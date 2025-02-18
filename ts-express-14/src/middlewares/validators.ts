import dotenv from 'dotenv';
dotenv.config();
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/client';


export const validateAddress = [
  check("firstLine").notEmpty().withMessage("First line is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("postcode").notEmpty().withMessage("Postcode is required"),
  (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


//valudate user, event
export const validateEvent = async (eventId: number) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    return event;
  };


  export const validateUser = async (userId : number) => {

    if (!userId) {
      console.error("validateUser: userNum is undefined");
      return null;
    }
    const user = await prisma.user.findUnique({ where: { id: userId },
     });
    return user;
  }


  export const validateGroup = async (groupId: number) => {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId
      }
    });
    return group;
  }
