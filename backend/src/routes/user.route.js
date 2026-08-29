import express from 'express'
import { authentication } from '../middleware/Authmiddleware.js';
import { getCurrentUser,updateProfile } from '../controllers/user.controller.js';
import multer from 'multer';
const upload = multer({ dest: "./public" });

const userRouter = express.Router();
userRouter.get('/current-user',authentication,getCurrentUser)
userRouter.post('/update-profile',authentication,upload.none(),updateProfile)

export {userRouter}