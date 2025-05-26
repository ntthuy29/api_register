import express from 'express';
import { registerUser , loginUser,forgetPassword} from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login',loginUser);
authRouter.post('/resetPassword',forgetPassword);

export default authRouter;
