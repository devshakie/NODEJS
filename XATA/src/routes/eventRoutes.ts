import { Router } from "express";
import { checkSchema } from 'express-validator';

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  patchEvent,
  deleteEvent,
} from "../controllers/eventControllers";
import { eventValidatorSchema, validateEvent} from "../middlewares/validators/eventValidators";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", checkSchema(eventValidatorSchema),validateEvent, createEvent);
router.put("/:id", updateEvent);
router.patch("/:id", patchEvent);
router.delete("/:id", deleteEvent);

export default router;
