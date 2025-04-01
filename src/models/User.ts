import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  address: string;
  nationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    address: {
      type: String,
      required: [true, 'Please provide a wallet address'],
      unique: true,
      lowercase: true,
    },
    nationId: {
      type: String,
      ref: 'Nation',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting during hot reloads
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Cast to any to avoid TypeScript errors with mongoose methods
export default UserModel as any;
