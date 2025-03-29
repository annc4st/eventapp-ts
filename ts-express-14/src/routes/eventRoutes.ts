import { Router } from 'express';
import {getAllEvents, getFutureEvents, getSingleEvent, createEvent, updateEvent} from '../controllers/event.controller'
import { createComment, getComments  } from '../controllers/comment.controller';
import { authenticateToken } from '../middlewares/authenticate';
import { signUpForEvent, getParticipantsByEvent, unsignFromEvent } from '../controllers/participant.controller';

import { getLikesOfEvent, toggleLike } from '../controllers/likes.controller';


const eventRouter = Router();

eventRouter.get("/", getFutureEvents )
eventRouter.get("/past", getAllEvents)
eventRouter.get("/:id", getSingleEvent)
eventRouter.post("/", authenticateToken, createEvent ) //authenticateToken
eventRouter.patch("/:id", authenticateToken, updateEvent)


//comments
eventRouter.post("/:eventId/comments", authenticateToken, createComment) 
eventRouter.get("/:eventId/comments", getComments)

//particpants
eventRouter.get("/:eventId/participants", getParticipantsByEvent);
eventRouter.post("/:eventId/participants", authenticateToken, signUpForEvent);
eventRouter.delete("/:eventId/participants", authenticateToken, unsignFromEvent);// user cancels his particpation


//likes
eventRouter.get("/:eventId/likes", getLikesOfEvent) ;
eventRouter.patch("/:eventId/likes", authenticateToken, toggleLike);



//middleware to check and debug
eventRouter.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url, req.params);
    next();
  });
  

export default eventRouter;
