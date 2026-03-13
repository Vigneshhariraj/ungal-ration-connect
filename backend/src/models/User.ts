import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'citizen' | 'authority' | 'volunteer';
export type CardType = 'APL' | 'BPL' | 'AAY' | 'PHH';

interface IFamilyMember {
  name: string;
  nameTamil: string;
  age: number;
  relation: string;
  isElderly: boolean;
  requiresHomeDelivery: boolean;
}

export interface IUser extends Document {
  name: string;
  nameTamil: string;
  phone: string;
  email: string;
  password?: string; // To be added for auth
  role: UserRole;
  rationCardNumber?: string;
  cardType?: CardType;
  wardNumber?: string;
  taluk?: string;
  area?: string;
  familyMembers: IFamilyMember[];
  isElderly: boolean;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const familyMemberSchema = new Schema<IFamilyMember>({
  name: { type: String, required: true },
  nameTamil: { type: String, required: true },
  age: { type: Number, required: true },
  relation: { type: String, required: true },
  isElderly: { type: Boolean, default: false },
  requiresHomeDelivery: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    nameTamil: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using OTP
    role: { type: String, enum: ['citizen', 'authority', 'volunteer'], default: 'citizen' },
    rationCardNumber: { type: String },
    cardType: { type: String, enum: ['APL', 'BPL', 'AAY', 'PHH'] },
    wardNumber: { type: String },
    taluk: { type: String },
    area: { type: String },
    familyMembers: [familyMemberSchema],
    isElderly: { type: Boolean, default: false },
    profilePhoto: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
