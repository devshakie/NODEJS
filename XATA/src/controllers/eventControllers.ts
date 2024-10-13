import { Request, Response } from "express";
import { xataClient } from "../utils/xataClient";

//GET all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await xataClient.db.events.getMany(); // Fetch all events
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve events." });
  }
};

// READ a single event by ID
export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedID = parseInt(id, 10);

  if (isNaN(parsedID)) {
    res.status(400).send({ error: "Invalid ID." });
  }
  try {
    //const event = await xataClient.db.events.read(id); // Fetch a single event
    const event = await xataClient.db.events
      .filter({ ID: parsedID })
      .getFirst();
    if (!event) {
      res.status(404).send({ error: "Event not found." });
    } else {
      res.status(200).send(event);
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve the event." });
  }
};

// CREATE a new event
export const createEvent =
  //eventValidator,
  async (req: Request, res: Response) => {
    const { body } = req;
    const latestEvent = await xataClient.db.events
      .sort("ID", "desc")
      .getFirst();
    const newId = (latestEvent?.ID ?? 0) + 1;
    try {
      const newEvent = await xataClient.db.events.create({
        ...body,
        ID: newId,
      });
      res.status(201).send(newEvent);
    } catch (error) {
      res.status(500).send({ error: "Failed to create the event." });
    }
  };
// UPDATE an event by ID
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  const parsedID = parseInt(id, 10);

  try {
    const existingEvent = await xataClient.db.events
      .filter({ ID: parsedID })
      .getFirst();
    if (!existingEvent) {
      res.status(404).send({ error: "Event not found." });
    } else {
      const updatedEvent = await xataClient.db.events.update(
        existingEvent.id,
        body
      );
      res.status(200).send(updatedEvent);
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to update the event." });
  }
};

// PATCH an event by ID (partial update)
export const patchEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req; // Only the fields that need to be updated
  const parsedID = parseInt(id, 10);

  if (isNaN(parsedID)) {
    res.status(400).send({ error: "Invalid ID format." });
    return;
  }

  try {
    const existingEvent = await xataClient.db.events
      .filter({ ID: parsedID })
      .getFirst();

    if (!existingEvent) {
      res.status(404).send({ error: "Event not found." });
      return;
    }

    // Merge the existing event data with the new partial data
    const updatedEvent = await xataClient.db.events.update(existingEvent.id, {
      ...existingEvent,
      ...body,
    });

    res.status(200).send(updatedEvent);
  } catch (error) {
    res.status(500).send({ error: "Failed to update the event." });
  }
};

// DELETE an event by ID
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedID = parseInt(id, 10);

  if (isNaN(parsedID)) {
    res.status(400).send({ error: "Invalid ID format" });
    return;
  }
  try {
    const event = await xataClient.db.events
      .filter({ ID: parsedID })
      .getFirst();
    if (!event) {
      res.status(404).send({ error: "Event not found." });
    } else {
      await xataClient.db.events.delete(event.id);
      res.status(204).send(); // No content on successful delete
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to delete the event." });
  }
};
