import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodItem extends Document {
  itemNumber: number;
  name: string;
  nameTamil: string;
  unit: 'kg' | 'L' | 'pcs';
  specification: string;
  totalQuantity: number;
  distributedQuantity: number;
  availableQuantity: number;
  distributionPerFamily: number;
  pricePerUnit: number;
  isVotingEnabled: boolean;
  totalVotes: number;
  maxVotes: number;
  votePercentage: number;
}

const foodItemSchema = new Schema<IFoodItem>(
  {
    itemNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    nameTamil: { type: String, required: true },
    unit: { type: String, enum: ['kg', 'L', 'pcs'], required: true },
    specification: { type: String },
    totalQuantity: { type: Number, default: 0 },
    distributedQuantity: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 0 },
    distributionPerFamily: { type: Number, default: 0 },
    pricePerUnit: { type: Number, required: true },
    isVotingEnabled: { type: Boolean, default: false },
    totalVotes: { type: Number, default: 0 },
    maxVotes: { type: Number, default: 100 },
    votePercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IFoodItem>('FoodItem', foodItemSchema);
