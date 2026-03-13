import mongoose, { Schema, Document } from 'mongoose';

interface IRationItem {
  itemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface IRationSchedule extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  slotNumber: number;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  items: IRationItem[];
  totalCost: number;
  status: 'upcoming' | 'ready' | 'collected';
  qrCode: string;
}

const rationItemSchema = new Schema<IRationItem>({
  itemId: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
});

const rationScheduleSchema = new Schema<IRationSchedule>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    slotNumber: { type: Number },
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopPhone: { type: String },
    items: [rationItemSchema],
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ['upcoming', 'ready', 'collected'], default: 'upcoming' },
    qrCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRationSchedule>('RationSchedule', rationScheduleSchema);
