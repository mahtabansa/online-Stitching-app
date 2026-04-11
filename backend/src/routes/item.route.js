import express from "express";      
import { authentication } from "../middleware/Authmiddleware.js";
import { createItem ,DeleteItem,EditItem, getItemInmyCity } from "../controllers/item.controller.js";
import multer from "multer";
const upload = multer({dest:"./public"})
 
const itemRouter = express.Router();

itemRouter.post("/create-item", authentication, upload.single("image"), createItem);

itemRouter.post("/edit-item/:id", authentication, upload.single("image"), EditItem);

itemRouter.get("/delete-item/:id", authentication, DeleteItem);

itemRouter.get("/get-items-incity/:city", authentication, getItemInmyCity);

export { itemRouter };