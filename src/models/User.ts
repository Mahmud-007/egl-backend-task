import mongoose, { Schema, Document } from "mongoose";

// Interface for the user document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// User Schema definition
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// User model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
