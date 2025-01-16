import { Router } from 'express';
import {registerUser, login, getAllUsers} from '../controllers/user.controller';


const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', login);
userRouter.get('/users', getAllUsers);


export default userRouter;

/* how to use authetication for protected routes 
import { authenticateToken } from "./middlewares/util-functions";

userRouter.get("/protected-route", authenticateToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});

*/