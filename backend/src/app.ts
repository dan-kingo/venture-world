import express, {Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req:Request, res:Response) => {
  res.json({ status: "Venture World Backend Running" });
});

export default app;
