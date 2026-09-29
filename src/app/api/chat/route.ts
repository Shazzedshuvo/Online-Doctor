import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Conversation, IMessage } from '@/models/Conversation';
import { MemoryItem } from '@/models/MemoryItem';
import { callGemini, GeminiChatMessage, UserMemoryContext } from '@/lib/gemini';
import { AuditLog } from '@/models/AuditLog';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const {
      conversationId,
      message,
      language = 'bn',
      messagesHistory = [],
      clientMessageId,
    } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'বার্তা খালি হতে পারে না (Message cannot be empty)' },
        { status: 400 }
      );
    }

    const cleanUserText = message.trim();
    const sessionUser = await getSessionUser(req);
    await connectToDatabase();

    // 1. Gather User Memory Context (only if user consented to rememberHealthInfo)
    const memoryContext: UserMemoryContext = {
      allergies: [],
      conditions: [],
      currentMedicines: [],
      pregnancyStatus: undefined,
      preferredLanguage: language === 'en' ? 'en' : 'bn',
    };

    const patientProfile = {
      name: sessionUser?.name,
      age: sessionUser?.profile?.age,
      gender: sessionUser?.profile?.gender,
    };

    if (sessionUser && sessionUser.settings.rememberHealthInfo) {
      // Fetch confirmed and active health memories for this user
      const activeMemories = await MemoryItem.find({
        userId: sessionUser._id,
        isConfirmed: true,
        status: 'active',
      }).lean();

      for (const item of activeMemories) {
        if (item.infoType === 'allergy') {
          memoryContext.allergies?.push(item.value);
        } else if (item.infoType === 'condition') {
          memoryContext.conditions?.push(item.value);
        } else if (item.infoType === 'medicine') {
          memoryContext.currentMedicines?.push(item.value);
        } else if (item.infoType === 'pregnancy') {
          memoryContext.pregnancyStatus = item.value;
        }
      }

      // Also merge profile-level allergies/conditions if not already present
      if (sessionUser.profile?.medicineAllergies) {
        for (const a of sessionUser.profile.medicineAllergies) {
          if (a && !memoryContext.allergies?.includes(a)) memoryContext.allergies?.push(a);
        }
      }
      if (sessionUser.profile?.medicalConditions) {
        for (const c of sessionUser.profile.medicalConditions) {
          if (c && !memoryContext.conditions?.includes(c)) memoryContext.conditions?.push(c);
        }
      }
      if (sessionUser.profile?.currentMedicines) {
        for (const m of sessionUser.profile.currentMedicines) {
          if (m && !memoryContext.currentMedicines?.includes(m)) memoryContext.currentMedicines?.push(m);
        }
      }
      if (sessionUser.profile?.pregnancyStatus) {
        memoryContext.pregnancyStatus = sessionUser.profile.pregnancyStatus;
      }
    }

    // 2. Prepare Conversation History
    let conversationDoc: any = null;
    const conversationMessages: GeminiChatMessage[] = [];

    if (sessionUser && sessionUser.settings.saveChatHistory && conversationId) {
      conversationDoc = await Conversation.findOne({
        _id: conversationId,
        userId: sessionUser._id,
        isDeleted: false,
      });

      if (conversationDoc) {
        // Prevent duplicate messages if user retried with clientMessageId
        if (clientMessageId) {
          const duplicate = conversationDoc.messages.find(
            (m: IMessage) => m.id === clientMessageId
          );
          if (duplicate && duplicate.status === 'completed') {
            return NextResponse.json({
              reply: duplicate.content,
              conversationId: conversationDoc._id,
              isEmergency: duplicate.isEmergency,
              proposedMemories: duplicate.proposedMemories || [],
              suggestedFollowUps: duplicate.suggestedActions || [],
            });
          }
        }

        // Bounded recent message history (last 12 messages for performance & token efficiency)
        const recentMessages = conversationDoc.messages.slice(-12);
        for (const msg of recentMessages) {
          if (msg.status === 'completed') {
            conversationMessages.push({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content,
            });
          }
        }
      }
    } else if (Array.isArray(messagesHistory) && messagesHistory.length > 0) {
      // For guest users or client-supplied history
      for (const m of messagesHistory.slice(-10)) {
        if (m.role && m.content) {
          conversationMessages.push({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          });
        }
      }
    }

    // Add current user prompt
    conversationMessages.push({
      role: 'user',
      content: cleanUserText,
    });

    const userMessageId = clientMessageId || nanoid();
    const assistantMessageId = nanoid();

    // 3. Call Google Gemini Backend
    let geminiResult;
    try {
      geminiResult = await callGemini(
        conversationMessages,
        memoryContext,
        patientProfile,
        language === 'en' ? 'en' : 'bn'
      );
    } catch (apiError: any) {
      const durationMs = Date.now() - startTime;
      await AuditLog.create({
        action: 'gemini_chat_call',
        category: 'chat_gemini',
        status: 'failure',
        statusCode: apiError.statusCode || 500,
        modelUsed: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        durationMs,
        errorMessage: apiError.message,
      }).catch(() => {});

      return NextResponse.json(
        {
          error: apiError.message || 'Gemini API call failed',
          code: apiError.code || 'API_ERROR',
        },
        { status: apiError.statusCode || 502 }
      );
    }

    const durationMs = Date.now() - startTime;

    // 4. Save to Database (if authenticated and user consented to saveChatHistory)
    let savedConversationId = conversationId;

    if (sessionUser && sessionUser.settings.saveChatHistory) {
      if (!conversationDoc) {
        // Create new conversation title from first few words
        const titleWords = cleanUserText.split(' ').slice(0, 5).join(' ');
        const autoTitle = titleWords.length > 35 ? `${titleWords.slice(0, 32)}...` : titleWords;

        conversationDoc = await Conversation.create({
          userId: sessionUser._id,
          isGuest: false,
          title: autoTitle || (language === 'bn' ? 'নতুন পরামর্শ' : 'New Consultation'),
          consentSettings: {
            saveChatHistory: sessionUser.settings.saveChatHistory,
            rememberHealthInfo: sessionUser.settings.rememberHealthInfo,
          },
          messages: [],
        });
        savedConversationId = conversationDoc._id.toString();
      }

      // Add user message
      conversationDoc.messages.push({
        id: userMessageId,
        role: 'user',
        content: cleanUserText,
        status: 'completed',
        timestamp: new Date(),
      });

      // Add assistant message with safety tags & proposed memories
      conversationDoc.messages.push({
        id: assistantMessageId,
        role: 'assistant',
        content: geminiResult.replyText,
        status: 'completed',
        timestamp: new Date(),
        isEmergency: geminiResult.isEmergency,
        proposedMemories: geminiResult.proposedMemories,
        suggestedActions: geminiResult.suggestedFollowUps,
      });

      await conversationDoc.save();

      // If proposed memories exist and user consented to rememberHealthInfo,
      // create pending memory items for the user to confirm!
      if (sessionUser.settings.rememberHealthInfo && geminiResult.proposedMemories.length > 0) {
        for (const item of geminiResult.proposedMemories) {
          const existingMemory = await MemoryItem.findOne({
            userId: sessionUser._id,
            infoType: item.type,
            key: item.key,
          });

          if (!existingMemory) {
            await MemoryItem.create({
              userId: sessionUser._id,
              infoType: item.type,
              key: item.key,
              value: item.value,
              isConfirmed: false, // User must explicitly confirm
              source: 'chat_consultation',
              sourceConversationId: conversationDoc._id,
              status: 'active',
              recordedAt: new Date(),
              lastConfirmedAt: new Date(),
            });
          }
        }
      }
    }

    // Audit log
    await AuditLog.create({
      action: 'gemini_chat_call',
      category: 'chat_gemini',
      status: 'success',
      statusCode: 200,
      modelUsed: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      durationMs,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      reply: geminiResult.replyText,
      conversationId: savedConversationId || null,
      userMessageId,
      assistantMessageId,
      isEmergency: geminiResult.isEmergency,
      emergencySummary: geminiResult.emergencySummary,
      proposedMemories: geminiResult.proposedMemories,
      suggestedFollowUps: geminiResult.suggestedFollowUps,
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return NextResponse.json(
      { error: err.message || 'অভ্যন্তরীণ সার্ভার ত্রুটি (Internal Server Error)' },
      { status: 500 }
    );
  }
}
