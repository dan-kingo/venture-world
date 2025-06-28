import { Request, Response } from "express";
import { itineraries } from "../data/itineraries";

/**
 * @desc Get static itinerary suggestions
 * @route GET /api/itineraries
 * @access Public
 */
export const getItineraries = (req: Request, res: Response) => {
  res.json(itineraries);
};
