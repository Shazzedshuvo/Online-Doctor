import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  isEmergency?: boolean;
  proposedMemories?: Array<{
    type: 'allergy' | 'condition' | 'medicine' | 'preference' | 'vital_note';
    key: string;
    value: string;
  }>;
  suggestedActions?: string[];
}

export interface IConversation extends Document {
  userId?: mongoose.Types.ObjectId;
  isGuest: boolean;
  guestSessionId?: string;
  title: string;
  consentSettings: {
    saveChatHistory: boolean;
    rememberHealthInfo: boolean;
  };
  messages: IMessage[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
    timestamp: { type: Date, default: Date.now },
    isEmergency: { type: Boolean, default: false },
    proposedMemories: [
      {
        type: {
          type: String,
          enum: ['allergy', 'condition', 'medicine', 'preference', 'vital_note'],
        },
        key: { type: String },
        value: { type: String },
      },
    ],
    suggestedActions: [{ type: String }],
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    isGuest: { type: Boolean, default: false },
    guestSessionId: { type: String, index: true },
    title: { type: String, required: true, default: 'নতুন পরামর্শ (New Consultation)' },
    consentSettings: {
      saveChatHistory: { type: Boolean, default: true },
      rememberHealthInfo: { type: Boolean, default: true },
    },
    messages: { type: [MessageSchema], default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);
