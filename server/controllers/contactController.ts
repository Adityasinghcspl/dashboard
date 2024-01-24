import asyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import Contact from "../models/contactModel";
import mongoose from 'mongoose';
import { AuthenticatedRequest } from "../middlewares/validateTokenHandler"; // Import the AuthenticatedRequest interface

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});


//@desc Create New contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const { firstName, lastName, email, phone, department, company }: { firstName: string, lastName: string, email: string, phone: number, department: string, company: string } = req.body;
  const name = firstName +" "+ lastName;
  if (!name || !email || !phone || !department || !company) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const userId = (req.user as { _id: string })?._id;
  const contact = await Contact.create({ name, email, phone, department, company, user_id: userId });
  res.status(201).send({ contact: contact, msg:'User created successfully'});
});


//@desc Get contact
//@route GET /api/contacts/:id
// //@access private

const getContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Invalid Contact ID' });
    return;
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    const error = new Error('Contact not found');
    res.status(404).json({ error: 'Contact not found' });
    throw error; // Throw the error to be caught by asyncHandler
  }
  res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Invalid Contact ID' });
    return;
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Invalid Contact ID' });
    return;
  }
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

export { getContacts, createContact, getContact, updateContact, deleteContact }