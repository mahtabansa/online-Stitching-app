import express from "express";      
import { authentication } from "../middleware/Authmiddleware.js";
import { createEditItem } from "../controllers/item.controller.js";
import { upload } from "../utils/multer.js";    
const itemRouter = express.Router();

itemRouter.post("/create-edit-item", authentication, upload.single("image"), createEditItem);
export { itemRouter };