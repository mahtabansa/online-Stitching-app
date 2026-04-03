import express from "express";
import { authentication } from "../middleware/Authmiddleware.js";
import { createEditShop ,getMyShop,getShopsInMyCity} from "../controllers/shop.controller.js";
import multer from "multer";
const upload = multer({ dest: "./public" });    

const shopRouter = express.Router();

shopRouter.post("/create-edit-shop",authentication ,upload.single("image"),createEditShop);

shopRouter.get("/my-shop",authentication ,getMyShop);

shopRouter.get("/shops-in-my-city/:city",authentication ,getShopsInMyCity);

export {shopRouter}