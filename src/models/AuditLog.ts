import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  category: 'auth' | 'chat_gemini' | 'medicine_import' | 'report_gen' | 'system';
  status: 'success' | 'failure' | 'warning';
  statusCode?: number;
  modelUsed?: string;
  durationMs?: number;
  errorMessage?: string;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    category: {
      type: String,
      enum: ['auth', 'chat_gemini', 'medicine_import', 'report_gen', 'system'],
      default: 'system',
      index: true,
    },
    status: {
      type: String,
      enum: ['success', 'failure', 'warning'],
      required: true,
      index: true,
    },
    statusCode: { type: Number },
    modelUsed: { type: String },
    durationMs: { type: Number },
    errorMessage: { type: String },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
