import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  titleTamil: string;
  message: string;
  messageTamil: string;
  type: 'voting' | 'ration' | 'delivery' | 'system';
  isRead: boolean;
  isImportant: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    titleTamil: { type: String, required: true },
    message: { type: String, required: true },
    messageTamil: { type: String, required: true },
    type: { type: String, enum: ['voting', 'ration', 'delivery', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', notificationSchema);
