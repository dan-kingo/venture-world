import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import experienceRoutes from "./routes/experience.routes";
import adminRoutes from "./routes/admin.routes";
import bookingRoutes from "./routes/booking.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",authRoutes);
app.use('/api', experienceRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api', bookingRoutes);

export default app;
