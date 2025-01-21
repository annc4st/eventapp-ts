import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticate';
import {getParticipantsByEvent, adminCancelParticpation } from '../controllers/participant.controller';


const adminRouter = Router();
adminRouter.get("/:eventId/participants", authenticateToken, getParticipantsByEvent); // admin gets all participants
adminRouter.delete("/:eventId/participants", authenticateToken, adminCancelParticpation); // admin cancels participation



export default adminRouter;