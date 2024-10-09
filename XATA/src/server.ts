// import express, { Express, Request, Response } from 'express';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getXataClient } from './xata';

dotenv.config();

const app: Express = express();
const port: number = 3000;
const xataClient = getXataClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/api/v1/events', async (req: Request, res: Response) => {
  try {
    const events = await xataClient.db.events.getMany(); // Fetch all events
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve events.' });
  }
});

// READ a single event by ID
app.get('/api/v1/events/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await xataClient.db.events.read(id); // Fetch a single event
    if (!event) {
      res.status(404).send({ error: 'Event not found.' });
    } else {
      res.status(200).send(event);
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve the event.' });
  }
});

// CREATE a new event
app.post('/api/v1/events', async (req: Request, res: Response) => {
  const { name, location, description,price,company} = req.body;
  try {
    const newEvent = await xataClient.db.events.create({
      name,
      location,
      description,
      price,
      company,
    });
    res.status(201).send(newEvent);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create the event.' });
  }
});
// UPDATE an event by ID
app.put('/api/v1/events/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name,location, description, price,company} = req.body;
  try {
    const updatedEvent = await xataClient.db.events.update({
      id,
      name,
      location,
      description,
      price,
      company,
    });
    if (!updatedEvent) {
      res.status(404).send({ error: 'Event not found.' });
    } else {
      res.status(200).send(updatedEvent);
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to update the event.' });
  }
});

// DELETE an event by ID
app.delete('/api/v1/events/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await xataClient.db.events.delete(id); // Delete the event
    res.status(204).send(); 
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete the event.' });
  }
});



