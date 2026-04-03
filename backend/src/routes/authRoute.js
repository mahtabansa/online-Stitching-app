import { login, logout, signup } from '../controllers/authController.js';
import express from 'express'
import { authentication  } from '../middleware/Authmiddleware.js';   
// import { EditProfile } from '../controllers/userController.js';
import { AddImage } from '../controllers/authController.js';
import multer from 'multer';

const upload = multer({ dest: "./public" });

export const authRouter = express.Router();

authRouter.post('/',authentication);
authRouter.post("/signup",upload.single("image"),signup);
authRouter.post("/login",login);
authRouter.post("/logout" ,logout);
authRouter.post("/add-image", authentication, upload.single("image"), AddImage);

// authRouter.post("/edit-profile" ,authentication, EditProfile);