import express from "express";
import {
  Createorder,
  getMyOrders,
  CancelOrder,
  AcceptOrder,
  savePickupTime,
  sendPickupOtp,
  verifyPickupOtp,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  UpdateStatus
} from "../controllers/order.controller.js";

import { authentication } from "../middleware/Authmiddleware.js";


const orderRouter = express.Router();
orderRouter.post("/place-order", authentication, Createorder);
orderRouter.get("/get-my-orders", authentication, getMyOrders);
orderRouter.post("/cancel-order/:id", authentication, CancelOrder);

orderRouter.post("/accept/:orderId", authentication, AcceptOrder);
orderRouter.post("/pickup-time/:orderId", authentication, savePickupTime);
orderRouter.post("/pickup/send-otp/:orderId", authentication, sendPickupOtp);
orderRouter.post(
  "/pickup/verify-otp/:orderId",
  authentication,
  verifyPickupOtp,
);
orderRouter.post(
  "/delivery/send-otp/:orderId",
  authentication,
  sendDeliveryOtp,
);
orderRouter.post(
  "/delivery/verify-otp/:orderId",
  authentication,
  verifyDeliveryOtp,
);

orderRouter.post(
  "/delivery/update-status/:orderId",
  authentication,
  // async(req,res)=>{
  //   const orderId = req.params;
  //   const status = req.body;
  //   const user = User.findByIdAndUpdate(orderId);
  //   if(!user){
  //     console.log('user not found')
  //   }
  // },
  UpdateStatus
);




export { orderRouter };
