import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  votedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  },
  { timestamps: true }
);

// Ensure a user can only vote for an item once (or handle this in logic)
voteSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model<IVote>('Vote', voteSchema);
