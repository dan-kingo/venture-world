import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import experienceRoutes from "./routes/experience.routes";
import adminRoutes from "./routes/admin.routes";
import bookingRoutes from "./routes/booking.routes";
import itineraryRoutes from "./routes/itinerary.routes";
import healthRoutes from "./routes/health.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check route (no auth required)
app.use("/api", healthRoutes);

// Other routes
app.use("/api/auth", authRoutes);
app.use('/api', experienceRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api', bookingRoutes);
app.use("/api", itineraryRoutes);

export default app;