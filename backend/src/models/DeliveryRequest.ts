import mongoose, { Schema, Document } from 'mongoose';

interface IRationItem {
  itemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface IDeliveryRequest extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  address: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  volunteerId?: mongoose.Types.ObjectId;
  volunteerName?: string;
  items: IRationItem[];
  notes?: string;
  createdAt: Date;
}

const rationItemSchema = new Schema<IRationItem>({
  itemId: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
});

const deliveryRequestSchema = new Schema<IDeliveryRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'in_progress', 'completed', 'rejected'], default: 'pending' },
    volunteerId: { type: Schema.Types.ObjectId, ref: 'User' },
    volunteerName: { type: String },
    items: [rationItemSchema],
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDeliveryRequest>('DeliveryRequest', deliveryRequestSchema);
