import express from "express"
import { Createorder,getMyOrders } from "../controllers/order.controller.js";
import { authentication } from "../middleware/Authmiddleware.js";

const orderRouter = express.Router();
orderRouter.post('/place-order',authentication,Createorder)
orderRouter.get('/get-my-orders',authentication,getMyOrders)


export {orderRouter}
