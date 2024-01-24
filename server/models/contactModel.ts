import mongoose, { Schema, Model } from "mongoose";

interface Contact {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  phone: Number;
  department: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchemaDefinition: Record<keyof Omit<Contact, "_id" | "createdAt" | "updatedAt">, any> = {
  user_id: {
    type: String,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add the contact name"],
  },
  email: {
    type: String,
    required: [true, "Please add the contact email address"],
  },
  phone: {
    type: Number,
    required: [true, "Please add the contact phone number"],
  },
  department: {
    type: String,
    required: [true, "Please add the contact department"],
  },
  company: {
    type: String,
    required: [true, "Please add the contact company"],
  }
};

const contactSchema: Schema<Contact> = new mongoose.Schema(contactSchemaDefinition, {
  timestamps: true,
});

const contactModel: Model<Contact> = mongoose.model<Contact>("Contact", contactSchema);

export default contactModel;
