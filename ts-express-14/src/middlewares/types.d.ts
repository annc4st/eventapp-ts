import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {id: number ; email: string} | JwtPayload; // Adjust type based on the payload structure of your JWT
        }
    }
}