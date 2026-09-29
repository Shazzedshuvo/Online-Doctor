import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedicine extends Document {
  brandName: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  dosageForm: string; // e.g. Tablet, Capsule, Syrup, Suspension, Injection, Eye Drops
  generalUses: string[]; // Indications / uses
  warnings: string;
  sideEffects: string;
  interactions: string;
  pregnancyCategory?: string;
  priceBdt?: number;
  imageUrl?: string;
  tabletAppearance?: string; // Visual guide so people recognize the tablet
  packagingColor?: string;
  dataSource: string; // e.g. "DGDA Approved National Formulary (Bangladesh)"
  lastVerificationDate: Date;
  isVerified: boolean;
  importedBatchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    brandName: { type: String, required: true, index: true },
    genericName: { type: String, required: true, index: true },
    manufacturer: { type: String, required: true, index: true },
    strength: { type: String, required: true },
    dosageForm: { type: String, required: true, index: true },
    generalUses: { type: [String], default: [], index: true },
    warnings: { type: String, default: 'চিকিৎসকের পরামর্শ ছাড়া সেবন নিষেধ।' },
    sideEffects: { type: String, default: 'প্রয়োজনে চিকিৎসকের পরামর্শ নিন।' },
    interactions: { type: String, default: 'অন্যান্য ওষুধের সাথে মিথস্ক্রিয়া এড়াতে চিকিৎসকের সাথে কথা বলুন।' },
    pregnancyCategory: { type: String, default: 'C' },
    priceBdt: { type: Number },
    imageUrl: { type: String },
    tabletAppearance: { type: String },
    packagingColor: { type: String },
    dataSource: {
      type: String,
      default: 'DGDA Approved Bangladesh National Formulary (Verified Sample Dataset)',
    },
    lastVerificationDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: true },
    importedBatchId: { type: String },
  },
  {
    timestamps: true,
  }
);

// Compound text index for robust full-text search
MedicineSchema.index({
  brandName: 'text',
  genericName: 'text',
  manufacturer: 'text',
  generalUses: 'text',
});

export const Medicine: Model<IMedicine> =
  mongoose.models.Medicine ||
  mongoose.model<IMedicine>('Medicine', MedicineSchema);
