import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, min: 2, max: 50 },
    lastName: { type: String, required: true, min: 2, max: 50 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "viewer"],
      default: "viewer",
    },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
