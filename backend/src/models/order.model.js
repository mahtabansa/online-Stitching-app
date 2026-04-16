import mongoose from "mongoose";
import { Schema } from "mongoose";

const shopOrderItemSchema =new Schema(
  {

    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name:String,
    price: Number,
    quantity: Number,
    
  },
  { timestamps: true },
);


const ShopOrderSchema =new Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal:Number,
    shopOrderItems: [shopOrderItemSchema],
    status:{
      type:String,
      // enum:["pending","preparing","out of delivery","delivered"],
       enum:["08-10 AM","10-12 PM ","12-02 PM","02-04 PM","02-04 PM","04-06 PM","06-08 PM","08-10 PM"],
       default:"08-10 PM"
    },


  },
  { timestamps: true },
);


const orderSchema =new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
       
    StitchingMethod: {
      type: String,
     
    },
    paymentMethod: {
      type: String,
     
    },
    deliveryAddress:{
      type: String,
    },
    longitude: Number,
    latitude: Number,

    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrder: [ShopOrderSchema],

    payment:{
      type:Boolean,
      default:false
    },

  },


  { timestamps: true },
);


const Order =  mongoose.model("Order", orderSchema);
export { Order };



// const ShopOrderSchema =new Schema(
//   {
//     shop: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Shop",
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     subtotal:Number,
//     shopOrderItems: [shopOrderItemSchema],
//     status:{
//       type:String,
//       // enum:["pending","preparing","out of delivery","delivered"],
//        enum:["08-10 AM","10-12 PM ","12-02 PM","02-04 PM","02-04 PM","04-06 PM","06-08 PM","08-10 PM"],
//        default:"08-10 PM"
//     },

//     assignment:{
//       type: mongoose.Schema.Types.ObjectId,
//       ref:"DeliveryAssignment",
//       default:null
//     },
//     assignedDeliveryBoy:{
//        type: mongoose.Schema.Types.ObjectId,
//        ref:"User",     
//     },
//       deliveryOtp: {
//       type: String,
//       default:null
//     },
//     expiresOtp:{
//       type:Date
//     },
//     deliveredAt:{type:Date}
//   },
//   { timestamps: true },
// );