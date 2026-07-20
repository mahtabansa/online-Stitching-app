import express from "express";      
import { authentication } from "../middleware/Authmiddleware.js";
import { createItem ,DeleteItem,EditItem, getItemInmyCity,searchItem } from "../controllers/item.controller.js";
import multer from "multer";
const upload = multer({dest:"./public"})
 
const itemRouter = express.Router();

itemRouter.post("/create-item", authentication, upload.array("images",3), createItem);

itemRouter.post("/edit-item/:id", authentication, upload.array("images",3), EditItem);

itemRouter.get("/delete-item/:id", authentication, DeleteItem);

itemRouter.get("/get-items-incity/:city", getItemInmyCity);

itemRouter.get("/search-item", searchItem);

export { itemRouter };