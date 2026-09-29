import mongoose, { Schema, Document, Model } from 'mongoose';

export type MemoryInfoType =
  | 'allergy'
  | 'condition'
  | 'medicine'
  | 'preference'
  | 'vital_note'
  | 'pregnancy';

export interface IMemoryItem extends Document {
  userId: mongoose.Types.ObjectId;
  infoType: MemoryInfoType;
  key: string;
  value: string;
  isConfirmed: boolean;
  source: 'profile' | 'chat_consultation' | 'user_manual';
  sourceConversationId?: mongoose.Types.ObjectId;
  recordedAt: Date;
  lastConfirmedAt: Date;
  status: 'active' | 'outdated' | 'dismissed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemoryItemSchema = new Schema<IMemoryItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    infoType: {
      type: String,
      enum: ['allergy', 'condition', 'medicine', 'preference', 'vital_note', 'pregnancy'],
      required: true,
      index: true,
    },
    key: { type: String, required: true },
    value: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    source: {
      type: String,
      enum: ['profile', 'chat_consultation', 'user_manual'],
      default: 'user_manual',
    },
    sourceConversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    recordedAt: { type: Date, default: Date.now },
    lastConfirmedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'outdated', 'dismissed'],
      default: 'active',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const MemoryItem: Model<IMemoryItem> =
  mongoose.models.MemoryItem ||
  mongoose.model<IMemoryItem>('MemoryItem', MemoryItemSchema);
