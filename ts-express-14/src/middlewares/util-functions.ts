import dotenv from 'dotenv';
dotenv.config();
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
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



const jwtSecret = process.env.SECRET;
if (!jwtSecret) {
    throw new Error("JWT secret is not defined in the environment variables");
  }

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Access token required' });
  }

  //get token from authorization "Bearer lskjfslfks098sfs.slkjhfw.oisfjosd"
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" }); //"No token provided" 


  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string };
    console.log("Token verified, user ID:", decoded.id);

 //fetch usr from db
    const user = await prisma.user.findUnique({where: { id: decoded.id}});

    if(!user) {
      return res.status(404).json({error: "User not found" });
    }

    // Attach user to the request object
    req.user = { id: user.id, email: user.email };
    next();

  } catch (err){
    console.error("Error verifying token:", err);
    res.status(403).json({ error: "Invalid token" });
  }
  
};
