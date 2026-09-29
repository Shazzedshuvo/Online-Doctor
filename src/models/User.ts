import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProfile {
  age?: number;
  dob?: string;
  gender?: string;
  preferredLanguage?: 'bn' | 'en';
  medicalConditions?: string[];
  medicineAllergies?: string[];
  currentMedicines?: string[];
  pregnancyStatus?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
}

export interface IUserSettings {
  saveChatHistory: boolean;
  rememberHealthInfo: boolean;
  privacyConsentGiven: boolean;
  privacyConsentDate?: Date;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  profile: IUserProfile;
  settings: IUserSettings;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profile: {
      age: { type: Number },
      dob: { type: String },
      gender: { type: String },
      preferredLanguage: { type: String, enum: ['bn', 'en'], default: 'bn' },
      medicalConditions: { type: [String], default: [] },
      medicineAllergies: { type: [String], default: [] },
      currentMedicines: { type: [String], default: [] },
      pregnancyStatus: { type: String, default: '' },
      emergencyContact: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        relation: { type: String, default: '' },
      },
    },
    settings: {
      saveChatHistory: { type: Boolean, default: true },
      rememberHealthInfo: { type: Boolean, default: true },
      privacyConsentGiven: { type: Boolean, default: true },
      privacyConsentDate: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
