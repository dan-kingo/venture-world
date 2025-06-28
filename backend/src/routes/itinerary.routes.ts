import { Router } from "express";
import { getItineraries } from "../controllers/itinerary.controller";

const router = Router();

router.get("/itineraries", getItineraries);

export default router;
