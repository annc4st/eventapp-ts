import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { eventNames } from "process";
import { validateUser, validateEvent } from "../middlewares/validators";


export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
    next(err);
  }
};

export const getSingleEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Convert id to a number
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    const eventExists = await prisma.event.findUnique({
      where: { id: numericId },
    });
    if (!eventExists) {
      return res.status(401).json({ error: "Invalid event id" });
    }
    res.status(200).json(eventExists);
  } catch (err) {
    console.error("Error retrieving event:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err)
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
        
    const { name, date, distance, ticketPrice, locationId } = req.body;

     // Assuming date is provided as "2025-01-13T10:00:00" (ISO format including time)
    const eventDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }


    const newEvent = await prisma.event.create({
      data: {
        name,
        date: eventDate,
        distance,
        ticketPrice,
        locationId,
      },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error posting event:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err)
  }
};


export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, date, distance, ticketPrice, locationId } = req.body;

      // Convert id to a number
  const numericEventId = parseInt(id, 10);

  if (isNaN(numericEventId)) {
    return res.status(400).json({ error: "Invalid event ID format" });
  }

  //cehck whether event exists
  const eventExists = await validateEvent(numericEventId);
  if (!eventExists) {
    return res.status(404).json({ error: "Event not found" });
  }
      

  // Prepare the data object for updating
  const data: Record<string, any> = {};

  if (name !== undefined) data.name = name;
  if (date !== undefined) {
    const eventDate = new Date(date);
    // Validate the date only if it's provided
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    data.date = eventDate;
  }
  if (distance !== undefined) data.distance = distance;
  if (ticketPrice !== undefined) data.ticketPrice = ticketPrice;
  if (locationId !== undefined) data.locationId = locationId;

  // Perform the update
  const updatedEvent = await prisma.event.update({
    where: { id: numericEventId },
    data,
  });
    res.status(200).json(updatedEvent );
  } catch (err) {
    console.error("Error posting event:", err);
    res.status(500).json({ error: "Internal server error", details: err });
    next(err)
  }
};

