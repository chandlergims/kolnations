import mongoose, { Schema, Document } from 'mongoose';

export interface INation extends Document {
  name: string;
  founderAddress: string;
  memberCount: number;
  members: string[];
  territory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a nation name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    founderAddress: {
      type: String,
      required: [true, 'Please provide a founder address'],
      lowercase: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    members: {
      type: [String],
      default: [],
    },
    territory: {
      type: String,
      default: undefined, // Changed from null to undefined to work better with sparse index
      unique: true,
      sparse: true, // This allows multiple documents to have no territory field
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting during hot reloads
const NationModel = mongoose.models.Nation || mongoose.model<INation>('Nation', NationSchema);

// Cast to any to avoid TypeScript errors with mongoose methods
export default NationModel as any;
