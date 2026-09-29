/**
 * Server-Side Medical Client for Online Doctor (Bangladesh)
 * Strictly kept on server-side. Never exposes keys to browser or logs.
 */

export interface GeminiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UserMemoryContext {
  allergies?: string[];
  conditions?: string[];
  currentMedicines?: string[];
  pregnancyStatus?: string;
  preferredLanguage?: 'bn' | 'en';
}

export interface PatientProfileContext {
  name?: string;
  age?: number | string;
  gender?: string;
}

export interface GeminiResponseOutput {
  replyText: string;
  isEmergency: boolean;
  emergencySummary?: string;
  proposedMemories: Array<{
    type: 'allergy' | 'condition' | 'medicine' | 'preference' | 'vital_note';
    key: string;
    value: string;
  }>;
  suggestedFollowUps: string[];
}

const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-3.8-flash'];

export const MANDATORY_LEGAL_DISCLAIMER_BN =
  'আরও ভালো ও ব্যক্তিগত চিকিৎসা পরামর্শের জন্য নিবন্ধিত চিকিৎসকের সঙ্গে সরাসরি যোগাযোগ করুন।';

export const MANDATORY_LEGAL_DISCLAIMER_EN =
  'For better and personalized medical advice, please consult a registered medical practitioner directly.';

function buildSystemPrompt(
  memory: UserMemoryContext,
  profile: PatientProfileContext,
  lang: 'bn' | 'en' = 'bn'
): string {
  return `You are "Online Doctor" (অনলাইন ডক্টর), an empathetic, culturally knowledgeable, and safety-first healthcare virtual service tailored specifically for Bangladesh.

CRITICAL MEDICAL SAFETY & BD HEALTHCARE GUIDELINES:
1. YOU ARE NOT A LICENSED HUMAN DOCTOR. You provide safe healthcare guidance and preliminary suggestions.
2. MEDICINE SUGGESTIONS & SELF-CARE:
   - Actively suggest commonly available, safe, over-the-counter (OTC) medicines standard in Bangladesh for symptom relief:
     • জ্বর বা শরীর ব্যথায়: Napa বা Ace (Paracetamol 500mg) - ভরা পেটে ১টি করে দিনে ২-৩ বার।
     • তীব্র মাথাব্যথা বা মাইগ্রেন: Napa Extra (Paracetamol + Caffeine) - ভরা পেটে ১টি।
     • গ্যাস্ট্রিক, বুকজ্বালা বা এসিডিটি: Seclo (Omeprazole 20mg) অথবা Sergel / Maxpro (Esomeprazole 20mg) - সকালে বা রাতে খাবার ৩০ মিনিট আগে, অথবা Entacyd সাসপেনশন/ট্যাবলেট।
     • সর্দি, হাঁচি, এলার্জি বা চুলকানি: Alatrol (Cetirizine 10mg) অথবা Fexo (Fexofenadine 120mg) - রাতে ১টি করে।
     • পাতলা পায়খানা বা বমি: SMC ORS খাবার স্যালাইন - প্রতিবার পাতলা পায়খানার পর আধা লিটার পানিতে গুলিয়ে খেতে হবে।
     • গলা ব্যথা বা খুসখুসে কাশি: কুসুম গরম পানিতে লবণ দিয়ে গার্গল, মধু-আদা-তুলসী চা, লবঙ্গ।
   - Always clearly explain the dosage instructions (খাওয়ার নিয়ম, ভরা পেটে/খালি পেটে, দিনে কয়বার), precautions, and home remedies.
   - For antibiotics or prescription drugs, clearly explain that an MBBS doctor must be consulted for a prescription.
3. EMERGENCY PROTOCOL:
   - Identify acute emergencies immediately (acute crushing chest pain, stroke signs, severe breathlessness, massive bleeding, anaphylaxis).
   - Direct to dial 999 (Bangladesh National Emergency Service) or rush to the nearest hospital emergency room.
4. THOROUGH CLINICAL INQUIRY:
   - Proactively ask relevant follow-up questions:
     a) Main symptoms, duration, and severity
     b) Patient's age
     c) Existing health conditions (Diabetes, High BP, Kidney/Liver disease, Asthma)
     d) Drug allergies or pregnancy status
5. NO ASTERISKS OR STARS FORMATTING RULE:
   - IMPORTANT: DO NOT use markdown asterisks like ** or * anywhere in your text. Do NOT use **bold** with stars.
   - Use clean, natural text. For lists and points, use bullet dots (•), numbers (১, ২, ৩), dashes, and clean paragraphs.
6. LANGUAGE & TONE:
   - Default language is Bengali (${lang === 'bn' ? 'বাংলা' : 'English'}).
   - Seamlessly understand Bengali, English, and phonetic "Banglish" (e.g., "amar matha betha korche").
   - Respond in friendly, clear, respectful tone (${lang === 'bn' ? 'সহজ ও স্পষ্ট বাংলায়' : 'clear, compassionate English'}).
7. MANDATORY NOTICE:
   - At the bottom of every response, include:
     "${MANDATORY_LEGAL_DISCLAIMER_BN}"

PATIENT CONTEXT (Consented Data from authenticated user):
${profile.age ? `- Patient Age: ${profile.age}` : '- Patient Age: Not specified yet'}
${profile.gender ? `- Gender: ${profile.gender}` : ''}
${memory.allergies && memory.allergies.length > 0 ? `- Known Allergies: ${memory.allergies.join(', ')}` : '- Known Allergies: None recorded'}
${memory.conditions && memory.conditions.length > 0 ? `- Ongoing Conditions: ${memory.conditions.join(', ')}` : '- Ongoing Conditions: None recorded'}
${memory.currentMedicines && memory.currentMedicines.length > 0 ? `- Current Medicines: ${memory.currentMedicines.join(', ')}` : '- Current Medicines: None recorded'}
${memory.pregnancyStatus ? `- Pregnancy / Lactation: ${memory.pregnancyStatus}` : ''}

STRUCTURED EXTRACTION REQUIREMENT:
At the very end of your response, if you detect that the user just revealed a NEW or UPDATED medical allergy, chronic condition, or current medicine, or if this is an emergency, append a hidden machine-readable JSON block delimited exactly by \`\`\`json_metadata and \`\`\`.
Format:
\`\`\`json_metadata
{
  "isEmergency": boolean,
  "emergencySummary": string or null,
  "proposedMemories": [
    { "type": "allergy"|"condition"|"medicine"|"preference"|"vital_note", "key": "short_label", "value": "description" }
  ],
  "suggestedFollowUps": ["Question or quick reply 1", "Question or quick reply 2"]
}
\`\`\`
Do not guess diagnoses as memories. Only extract user-reported facts. If none, keep proposedMemories as [].`;
}

export async function callGemini(
  conversationMessages: GeminiChatMessage[],
  memory: UserMemoryContext = {},
  profile: PatientProfileContext = {},
  language: 'bn' | 'en' = 'bn'
): Promise<GeminiResponseOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    const err = new Error(
      language === 'bn'
        ? 'সার্ভারে Gemini API কী (Key) কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।'
        : 'Google Gemini API key is not configured on the server. Please contact system administrator.'
    );
    (err as any).code = 'MISSING_API_KEY';
    throw err;
  }

  const systemInstruction = buildSystemPrompt(memory, profile, language);

  // Prepare Gemini contents array
  const contents = conversationMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: contents,
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const rawText = candidate?.content?.parts?.[0]?.text || '';

        return parseGeminiOutput(rawText, language);
      }

      const errorBody = await response.text();
      let parsedErr: any = {};
      try {
        parsedErr = JSON.parse(errorBody);
      } catch {
        parsedErr = { message: errorBody };
      }

      const errorMsg = parsedErr?.error?.message || errorBody;
      const statusCode = response.status;

      // Classify error
      if (statusCode === 429) {
        const err = new Error(
          language === 'bn'
            ? 'Gemini API এর ব্যবহারের সীমা (Quota Limit) সাময়িকভাবে অতিক্রান্ত হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
            : 'Gemini API rate limit or quota exceeded. Please try again in a few moments.'
        );
        (err as any).code = 'QUOTA_EXCEEDED';
        (err as any).statusCode = 429;
        throw err;
      }

      if (statusCode === 503 || statusCode === 500) {
        console.warn(`Model ${modelName} returned status ${statusCode}, waiting and retrying/falling back...`);
        lastError = new Error(`Model ${modelName} temporary failure (${statusCode}): ${errorMsg}`);
        // Brief pause before trying next
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      if (statusCode === 404) {
        console.warn(`Model ${modelName} returned 404 (not found/deprecated), trying next available model...`);
        lastError = new Error(`Model ${modelName} not available: ${errorMsg}`);
        continue;
      }

      // Other 4xx error (e.g. 400, 403)
      const err = new Error(
        language === 'bn'
          ? `Gemini API অনুরোধে সমস্যা হয়েছে (${statusCode}): ${errorMsg}`
          : `Gemini API request failed (${statusCode}): ${errorMsg}`
      );
      (err as any).code = 'API_ERROR';
      (err as any).statusCode = statusCode;
      throw err;
    } catch (err: any) {
      if (err.code === 'QUOTA_EXCEEDED' || err.code === 'MISSING_API_KEY' || err.code === 'API_ERROR') {
        throw err;
      }
      lastError = err;
    }
  }

  // If all models failed
  const finalError = new Error(
    language === 'bn'
      ? 'Google Gemini সেবায় সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।'
      : 'Google Gemini service is temporarily overloaded or unavailable. Please retry shortly.'
  );
  (finalError as any).code = 'TEMPORARY_UNAVAILABLE';
  (finalError as any).originalMessage = lastError?.message;
  throw finalError;
}

function parseGeminiOutput(rawText: string, language: 'bn' | 'en'): GeminiResponseOutput {
  const metadataRegex = /```json_metadata\s*([\s\S]*?)\s*```/;
  const match = rawText.match(metadataRegex);

  let cleanText = rawText;
  let isEmergency = false;
  let emergencySummary: string | undefined;
  let proposedMemories: GeminiResponseOutput['proposedMemories'] = [];
  let suggestedFollowUps: string[] = [];

  if (match) {
    cleanText = rawText.replace(metadataRegex, '').trim();
    try {
      const meta = JSON.parse(match[1]);
      isEmergency = Boolean(meta.isEmergency);
      emergencySummary = meta.emergencySummary || undefined;
      if (Array.isArray(meta.proposedMemories)) {
        proposedMemories = meta.proposedMemories.filter(
          (m: any) => m && m.type && m.key && m.value
        );
      }
      if (Array.isArray(meta.suggestedFollowUps)) {
        suggestedFollowUps = meta.suggestedFollowUps.filter((q: any) => typeof q === 'string');
      }
    } catch (e) {
      console.warn('Failed to parse json_metadata block from Gemini output:', e);
    }
  }

  // Clean any remaining raw double asterisks from text
  cleanText = cleanText.replace(/\*\*/g, '');

  // Ensure mandatory disclaimer is present
  const mandatoryNotice =
    language === 'bn' ? MANDATORY_LEGAL_DISCLAIMER_BN : MANDATORY_LEGAL_DISCLAIMER_EN;
  if (!cleanText.includes(mandatoryNotice) && !cleanText.includes('নিবন্ধিত চিকিৎসকের')) {
    cleanText += `\n\n⚠️ জরুরি বিজ্ঞপ্তি: ${mandatoryNotice}`;
  }

  // Emergency heuristic fallback
  const emergencyKeywords = [
    'বুকের তীব্র ব্যথা',
    'heart attack',
    'stroke',
    'severe chest pain',
    'difficulty breathing',
    'শ্বাসকষ্ট চরম',
    '৯৯৯',
    '999',
    'রক্তক্ষরণ',
    'অচেতন',
    'unconscious',
  ];
  if (!isEmergency) {
    const hasEmergencyWord = emergencyKeywords.some((word) =>
      cleanText.toLowerCase().includes(word.toLowerCase())
    );
    if (hasEmergencyWord && (cleanText.includes('999') || cleanText.includes('৯৯৯') || cleanText.includes('হাসপাতাল'))) {
      isEmergency = true;
      emergencySummary =
        language === 'bn'
          ? 'সম্ভাব্য জরুরি স্বাস্থ্য পরিস্থিতি চিহ্নিত। দ্রুত জরুরি সেবা (৯৯৯) বা নিকটস্থ হাসপাতালে যোগাযোগ করুন।'
          : 'Potential health emergency detected. Contact 999 or proceed to nearest hospital immediately.';
    }
  }

  return {
    replyText: cleanText,
    isEmergency,
    emergencySummary,
    proposedMemories,
    suggestedFollowUps,
  };
}

export async function testGeminiConnection(): Promise<{
  connected: boolean;
  model: string;
  latencyMs: number;
  message: string;
  status: 'online' | 'error' | 'unconfigured';
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return {
      connected: false,
      model,
      latencyMs: 0,
      message: 'GEMINI_API_KEY is not configured in server environment variables.',
      status: 'unconfigured',
    };
  }

  const startTime = Date.now();
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Ping test. Reply with one word: Online' }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 10,
        },
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (res.status === 200) {
      return {
        connected: true,
        model,
        latencyMs,
        message: `Successfully connected to Google Gemini (${model}) in ${latencyMs}ms.`,
        status: 'online',
      };
    }

    const errText = await res.text();
    let msg = `HTTP ${res.status}`;
    try {
      const parsed = JSON.parse(errText);
      msg = parsed?.error?.message || errText;
    } catch {}

    return {
      connected: false,
      model,
      latencyMs,
      message: `Gemini API connection test failed: ${msg}`,
      status: 'error',
    };
  } catch (err: any) {
    return {
      connected: false,
      model,
      latencyMs: Date.now() - startTime,
      message: `Connection error: ${err.message || 'Unknown network error'}`,
      status: 'error',
    };
  }
}
