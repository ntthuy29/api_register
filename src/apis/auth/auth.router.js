import express from 'express';
import { registerUser , loginUser} from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login',loginUser);

export default authRouter;
