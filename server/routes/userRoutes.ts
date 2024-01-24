import express, { Router } from "express";
import {registerUser,loginUser,currentUser} from "../controllers/userController";
import { validateToken } from "../middlewares/validateTokenHandler";

const router: Router = express.Router();

router.post("/create", registerUser);
router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

export default router;