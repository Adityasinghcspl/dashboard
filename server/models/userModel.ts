import mongoose, { Schema, Model } from "mongoose";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// const userSchemaDefinition: Record<any, any> = {
const userSchemaDefinition: Record<keyof Omit<User, "_id" | "createdAt" | "updatedAt">, any> = {
  username: {
    type: String,
    required: [true, "Please add the user name"],
  },
  email: {
    type: String,
    required: [true, "Please add the user email address"],
    unique: [true, "Email address already taken"],
  },
  password: {
    type: String,
    required: [true, "Please add the user password"],
  },
  role: {
    type: String,
    required: [true, "Please add the user role"],
  }
};

const userSchema: Schema<User> = new mongoose.Schema(userSchemaDefinition, {
  timestamps: true,
});

const UserModel: Model<User> = mongoose.model<User>("User", userSchema);

export default UserModel;
