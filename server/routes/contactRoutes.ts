import express, { Router } from "express";
import { getContacts, createContact, getContact, updateContact, deleteContact } from "../controllers/contactController";
import { validateToken } from "../middlewares/validateTokenHandler";

const router: Router = express.Router();

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

export default router; 
