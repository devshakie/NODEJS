import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  patchEvent,
  deleteEvent,
} from "../controllers/eventControllers";
import { eventValidator } from "../middlewares/validators/eventValidators";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", eventValidator, createEvent);
router.put("/:id", updateEvent);
router.patch("/:id", patchEvent);
router.delete("/:id", deleteEvent);

export default router;
