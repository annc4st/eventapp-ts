import { Router } from 'express';
import {getAllEvents, getSingleEvent, createEvent, updateEvent} from '../controllers/event.controller'
import { createComment, getComments  } from '../controllers/comment.controller';
import { authenticateToken } from '../middlewares/authenticate';
import { signUpForEvent, getParticipantsByEvent, unsignFromEvent } from '../controllers/participant.controller';


const eventRouter = Router();

eventRouter.get("/", getAllEvents )
eventRouter.get("/:id", getSingleEvent)
eventRouter.post("/",  createEvent ) //authenticateToken
eventRouter.patch("/:id", updateEvent)

//comments
eventRouter.post("/:eventId/comments", authenticateToken, createComment) //authenticateToken
eventRouter.get("/:eventId/comments", getComments)

//particpants
eventRouter.get("/:eventId/participants", getParticipantsByEvent);
eventRouter.post("/:eventId/participants", authenticateToken, signUpForEvent);
eventRouter.delete("/:eventId/participants", authenticateToken, unsignFromEvent);// user cancels his particpation


//middleware to check and debug
eventRouter.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url, req.params);
    next();
  });
  

export default eventRouter;
