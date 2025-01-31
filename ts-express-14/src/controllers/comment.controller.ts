import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { validateUser, validateEvent } from "../middlewares/validators";


//add user as author to event 
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params; //id of the event
    //comment object
    const { content } = req.body;
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

     //cehck whether event exists
     const eventExists = await validateEvent(numericEventId);
          if (!eventExists) {
            return res.status(401).json({ error: "Invalid event id" });
          }
        
          const newComment = await prisma.comment.create({
            data: {
                content,
                event: {connect: {id: numericEventId} },
                user: { connect: { id: userId }  },
            },
          });
          res.status(201).json(newComment);
        } catch (err) {
            console.error("Error posting comment:", err);
            res.status(500).json({ error: "Internal server error" });
            next(err)
        }
}

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
     const { eventId } = req.params; 
   
    try {
        // Convert id to a number
        const numericEventId = parseInt(eventId, 10);
        if (isNaN(numericEventId)) {
            return res.status(400).json({ error: "Invalid event ID format" });
          }

     //cehck whether event exists
     const eventExists = await validateEvent(numericEventId );
          if (!eventExists) {
            return res.status(404).json({ error: "Event not found" });
          }

        const comments = await prisma.comment.findMany({where: {eventId: numericEventId },
        });
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err });
        next(err);
      }
    };
