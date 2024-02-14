import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, trim: true },
    encryptedPassword: { type: String, trim: true },
    role: {
      type: String,
      enum: ["user", "admin", "custom"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    profilePicture: { type: String },
    // address: {
    //   street: { type: String },
    //   city: { type: String },
    //   state: { type: String },
    //   zipCode: { type: String },
    // },
    // paymentInfo: { type: Schema.Types.Mixed },
    // preferences: { type: Schema.Types.Mixed },
    // orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    // lastLogin: { type: Date },
    // loginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
