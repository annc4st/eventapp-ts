import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import {validateUser,  validateEvent } from "../middlewares/validators";



export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
    next(err);
  }
};

export const getSingleEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(err);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const { name, date, distance, ticketPrice, locationId } = req.body;
    console.log("user found ?? ", req.user?.id)
    const userId = req.user?.id;
    
    // checking whether user exists
    const userExists = await validateUser(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      // Assuming date is provided as "2025-01-13T10:00:00" (ISO format including time)
    const eventDate = new Date(date);
 
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const parsedLocationId = parseInt(locationId, 10);
    // Handle invalid locationId values
    if (isNaN(parsedLocationId)) {
      return res
        .status(400)
        .json({ error: "Invalid locationId: must be a number" });
    }
    const newEvent = await prisma.event.create({
      data: {
        name,
        date: eventDate,
        distance,
        ticketPrice,
        locationId: parsedLocationId,
        userId,
      },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error posting event:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
};


export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, date, distance, ticketPrice, locationId } = req.body;
    const updatingUserId = req.user?.id;
    console.log("updatingUserId >> ", updatingUserId)

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

    // check if updatingUser is the owner of the event
    if(eventExists.userId !== updatingUserId) {
      return res.status(403).json({ error: "You are not authorized to update this event" });
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
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Internal server error", details: err });
    next(err);
  }
};


// add onDelete: Cascade to particpants on schema and migrate to make it possible
// export const deleteEvent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const updatingUserId = req.user?.id;
    
//     // Convert id to a number
//     const numericEventId = parseInt(id, 10);

//     if (isNaN(numericEventId)) {
//       return res.status(400).json({ error: "Invalid event ID format" });
//     }

//     //cehck whether event exists
//     const eventExists = await validateEvent(numericEventId);
//     if (!eventExists) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//        // check if updatingUser is the owner of the event
//        if(eventExists.userId !== updatingUserId) {
//         return res.status(403).json({ error: "You are not authorized to update this event" });
//       }

//     //Delete
//     const deletedEvent = await prisma.event.delete({
//       where: { id: numericEventId ,
//       },
//     });
//     res.status(200).json(deletedEvent);
//   } catch (err) {
//     console.error("Error deleting event:", err);
//     res.status(500).json({ error: "Internal server error", details: err });
//     next(err);
//   }
// };


// MANUAL DELETE OF Comments and participants in order to delete event
// const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   const numericEventId = parseInt(id, 10);
//   if (isNaN(numericEventId)) {
//     return res.status(400).json({ error: "Invalid event ID format" });
//   }

//   const event = await prisma.event.findUnique({
//     where: { id: numericEventId },
//     select: { userId: true },
//   });

//   if (!event) {
//     return res.status(404).json({ error: "Event not found" });
//   }

//   if (event.userId !== userId) {
//     return res.status(403).json({ error: "You are not authorized to delete this event" });
//   }

//   try {
//     await prisma.$transaction([
//       prisma.comment.deleteMany({ where: { eventId: numericEventId } }),
//       prisma.participant.deleteMany({ where: { eventId: numericEventId } }),
//       // Delete other related records as needed
//       prisma.event.delete({ where: { id: numericEventId } }),
//     ]);

//     res.status(200).json({ message: "Event and related records deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting event:", err);
//     res.status(500).json({ error: "Internal server error", details: err });
//     next(err);
//   }
// };