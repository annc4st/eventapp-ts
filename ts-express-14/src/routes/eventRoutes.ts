import { Router } from 'express';
import {getAllEvents, getSingleEvent, createEvent } from '../controllers/event.controller'
import { createComment, getComments  } from '../controllers/comment.controller';
import { authenticateToken } from '../middlewares/util-functions';



const eventRouter = Router();

eventRouter.get("/", getAllEvents )
eventRouter.get("/:id", getSingleEvent)
eventRouter.post("/",  createEvent ) //authenticateToken

//comments
//middleware to check and debug
// eventRouter.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url, req.params);
//   next();
// });
eventRouter.post("/:id/comments", authenticateToken, createComment) //authenticateToken
eventRouter.get("/:id/comments", getComments) 



export default eventRouter;
