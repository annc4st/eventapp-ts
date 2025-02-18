import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authenticate";
import prisma from "../../prisma/client";
import { validateUser, validateEvent } from "../middlewares/validators";

 
export const signUpForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
)  => {
     
  const { eventId } = req.params; //id of the event
  const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware
  // checking whether user exists
   
  const userExists = await validateUser(userId);
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    // Convert id to a number
    const numericEventId = parseInt(eventId, 10);
    if (isNaN(numericEventId)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    //check whether event exists
    const eventExists = await validateEvent(numericEventId);
    if (!eventExists) {
      return res.status(401).json({ error: "Invalid event id" });
    }

    const newPartcipant = await prisma.participant.create({
      data: {
        event: { connect: { id: numericEventId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(newPartcipant);
  } catch (err) {
    console.error("Error adding participant:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
};


export const getParticipantsByEvent = async (
    req: Request,
    res: Response,
    next: NextFunction) => {

        console.log("Incoming params:", req.params); // Debug log
 const { eventId } = req.params; //id of the event
 
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
    const participants =  await prisma.participant.findMany({
        where: { eventId: numericEventId},
        include: { user: true },
    });
    res.status(200).json(participants);
  } catch (err) {
    console.error("Error retrieving participants:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
}

// user cancels his particpation
// userId is taken from auth token
export const unsignFromEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("userid line 102 ",  req.user);

 
    try {
        const { eventId } = req.params; // eventId from the route
        const userId = req.user?.id; //

        const userExists = await validateUser(userId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
          }

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

      // find participant entry
    const participant = await prisma.participant.findFirst({
        where: {
            userId: userId,
            eventId: numericEventId,
        },
      });

      console.log("particpants found ? ", participant)
  
      if (!participant) {
        return res.status(404).json({ error: "You are not signed up for this event" });
      }
  //Delete
      await prisma.participant.delete({
        where: { id: participant.id },
      });
  
      res.status(200).json({ message: "Successfully unsigned from the event" });
        } catch (err) {
            console.error("Error unsigning from event:", err);
            res.status(500).json({ error: "Internal server error" });
            next(err);
    }
  }


// admin can cancel particpation - admin route
  export const adminCancelParticpation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
     
    try {
        const { eventId } = req.params;
        const {userId} = req.body; 

        if (!userId) {
          return res.status(400).json({ error: "Missing user ID in request body" });
        }

        const userExists = await validateUser(userId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
          }

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

      // find participant entry
    const participant = await prisma.participant.findFirst({
        where: {
            userId: userId,
            eventId: numericEventId,
        },
      });

      console.log("particpants found ? ", participant)
  
      if (!participant) {
        return res.status(404).json({ error: "User is not signed up for this event" });
      }
  //Delete
      await prisma.participant.delete({
        where: { id: participant.id },
      });
      res.status(200).json({ message: "Successfully unsigned from the event" });
    } catch (err) {
            console.error("Error unsigning from event:", err);
            res.status(500).json({ error: "Internal server error" });
            next(err);
    }
  }