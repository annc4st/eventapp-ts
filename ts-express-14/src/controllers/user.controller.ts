import { Request, Response } from 'express';
import prisma from '../../prisma/client'; // Import reusable Prisma client
const bcrypt = require("bcrypt");
import jwt from 'jsonwebtoken';


const saltRounds = 10;
const jwtSecret = process.env.SECRET

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

     // Email validation regex
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!emailRegex.test(email)) {
         return res.status(400).json({ error: "Invalid email format" });
     }

     const emailExists = await prisma.user.findUnique({
        where: { email},
     });
     if (emailExists) {
        return res.status(401).json({ error: "Email already registered" });
      }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: {
                email,
                hashedPassword,
            },
        });

        // Create a JWT token
        const token = jwt.sign({ id: newUser.id, email: newUser.email },
            jwtSecret,
            { expiresIn: '1h' });

        res.status(201).json({ id: newUser.id, email: newUser.email, token });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const userExists = await prisma.user.findUnique({ where: { email }, });
        if (!userExists) {
            return res.status(401).json({ error: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, userExists.hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: userExists.id, email: userExists.email },
            jwtSecret,
            { expiresIn: '1h', });
        // Respond with user details and token
        res.status(200).json({ id: userExists.id, email: userExists.email, token });
    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};