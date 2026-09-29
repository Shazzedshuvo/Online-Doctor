import mongoose from 'mongoose';
import { BANGLADESH_MEDICINES_DATASET } from '../src/lib/seed-medicines.ts';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI found in env');
  process.exit(1);
}

const MedicineSchema = new mongoose.Schema(
  {
    brandName: String,
    genericName: String,
    manufacturer: String,
    strength: String,
    dosageForm: String,
    generalUses: [String],
    warnings: String,
    sideEffects: String,
    interactions: String,
    pregnancyCategory: String,
    priceBdt: Number,
    imageUrl: String,
    tabletAppearance: String,
    packagingColor: String,
    dataSource: String,
    lastVerificationDate: Date,
    isVerified: Boolean,
  },
  { timestamps: true }
);

const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  await Medicine.deleteMany({});
  console.log('Cleared existing medicines');
  const res = await Medicine.insertMany(BANGLADESH_MEDICINES_DATASET);
  console.log(`Successfully seeded ${res.length} medicines with images and visual descriptions!`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
