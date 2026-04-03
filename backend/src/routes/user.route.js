import express from 'express'
import { authentication } from '../middleware/Authmiddleware.js';
import { getCurrentUser } from '../controllers/user.controller.js';

const userRouter = express.Router();
userRouter.get('/current-user',authentication,getCurrentUser)

export {userRouter}