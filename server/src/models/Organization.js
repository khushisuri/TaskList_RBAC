// models/Organization.ts
import { Schema, model, Types } from 'mongoose';

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    parentOrgId: { type: Types.ObjectId, ref: 'Organization', default: null }, 
  },
  { timestamps: true }
);

export default model('Organization', OrganizationSchema);
