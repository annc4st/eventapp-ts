import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { validateUser, validateEvent } from "../middlewares/validators";

export const getLikesOfEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { eventId } = req.params;

  // Convert id to a number
  const numericEventId = parseInt(eventId, 10);

  if (isNaN(numericEventId)) {
    return res.status(400).json({ error: "Invalid event ID format" });
  }

  //cehck whether event exists
  const eventExists = await validateEvent(numericEventId);
  if (!eventExists) {
    return res.status(401).json({ error: "Invalid event id" });
  }

  try {
    const totalLikes = await prisma.eventLikes.count({
      where: { eventId: numericEventId },
    });
    res.status(200).json({ likes: totalLikes });
  } catch (err) {
    console.error("Error retrieving likes:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // checking whether user exists
    const userExists = await validateUser(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const { eventId } = req.params; //id of the event
    const numericEventId = parseInt(eventId, 10);

    if (isNaN(numericEventId)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    //cehck whether event exists
    const eventExists = await validateEvent(numericEventId);
    if (!eventExists) {
      return res.status(401).json({ error: "Invalid event id" });
    }

    //  1 check if user has liked it already
    const existingLike = await prisma.eventLikes.findUnique({
      where: {
        eventId_userId: {
          eventId: numericEventId,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      await prisma.eventLikes.delete({
        where: {
          eventId_userId: {
            eventId: numericEventId,
            userId,
          },
        },
      });

      return res.status(200).json({ message: "Like removed" });
    } else {
      const newLike = await prisma.eventLikes.create({
        data: {
          eventId: numericEventId,
          userId,
        },
      });

      res.status(201).json(newLike);
    }
  } catch (err) {
    next(err);
  }
};
