import express, { Express } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDb from "./config/dbConnection";
import userRoutes from "./routes/userRoutes";
import contactRoutes from "./routes/contactRoutes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
connectDb();
// Middleware to parse JSON in request body
app.use(express.json());
app.use(cors());

app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});