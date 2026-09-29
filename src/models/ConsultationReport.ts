import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConsultationReport extends Document {
  reportId: string;
  userId?: mongoose.Types.ObjectId;
  conversationId?: mongoose.Types.ObjectId;
  patientName: string;
  patientAge?: string | number;
  patientGender?: string;
  dateDhaka: string;
  symptoms: string[];
  durationAndSeverity?: string;
  confirmedHealthInfo: {
    allergies: string[];
    conditions: string[];
    currentMedicines: string[];
    pregnancyStatus?: string;
  };
  discussionSummary: string;
  generalGuidance: string;
  recommendedNextSteps: string;
  emergencyWarnings?: string[];
  dataSources: string;
  clinicianVerification?: {
    isPrescriptionApproved: boolean;
    approvedByDoctorName?: string;
    bmdcRegistrationNumber?: string;
    hospitalAffiliation?: string;
    clinicianNotes?: string;
    prescribedMedicines?: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    approvedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationReportSchema = new Schema<IConsultationReport>(
  {
    reportId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', index: true },
    patientName: { type: String, default: 'বেনামী রোগী (Anonymous Patient)' },
    patientAge: { type: Schema.Types.Mixed },
    patientGender: { type: String, default: '' },
    dateDhaka: { type: String, required: true },
    symptoms: { type: [String], default: [] },
    durationAndSeverity: { type: String, default: '' },
    confirmedHealthInfo: {
      allergies: { type: [String], default: [] },
      conditions: { type: [String], default: [] },
      currentMedicines: { type: [String], default: [] },
      pregnancyStatus: { type: String, default: '' },
    },
    discussionSummary: { type: String, required: true },
    generalGuidance: { type: String, required: true },
    recommendedNextSteps: { type: String, required: true },
    emergencyWarnings: { type: [String], default: [] },
    dataSources: {
      type: String,
      default: 'অনলাইন ডক্টর সিস্টেম ও বিশ্ব স্বাস্থ্য সংস্থা / DGDA নির্দেশিকা',
    },
    clinicianVerification: {
      isPrescriptionApproved: { type: Boolean, default: false },
      approvedByDoctorName: { type: String },
      bmdcRegistrationNumber: { type: String },
      hospitalAffiliation: { type: String },
      clinicianNotes: { type: String },
      prescribedMedicines: [
        {
          name: { type: String },
          dosage: { type: String },
          duration: { type: String },
          instructions: { type: String },
        },
      ],
      approvedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const ConsultationReport: Model<IConsultationReport> =
  mongoose.models.ConsultationReport ||
  mongoose.model<IConsultationReport>('ConsultationReport', ConsultationReportSchema);
