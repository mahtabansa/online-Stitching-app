import mongoose from "mongoose";
import { Schema } from "mongoose";

const shopOrderItemSchema = new Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true },
);

const ShopOrderSchema = new Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal: Number,
    shopOrderItems: [shopOrderItemSchema],
    pickup: {
      type: String,
      enum: [
        "8-10 AM",
        "10-12 PM",
        "12-2 PM",
        "2-4 PM",
        "4-6 PM",
        "6-8 PM",
        "8-10 PM",
      ],
      default:null,
    },
  },
  { timestamps: true },
);

const orderSchema = new Schema(
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
    deliveryAddress: {
      type: String,
    },
    longitude: Number,
    latitude: Number,

    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrder: [ShopOrderSchema],

    payment: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "stitching",
        "out of delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    pickupOtp: {
      type: String,
      default: null,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    pickupOtpExpiry: {
      type: Date,
      default: null,
    },
    pickupVerifiedAt: {
      type: Date,
      default: null,
    },

    deliveryOtp: {
      type: String,
      default: null,
    },
  
    deliveryOtpExpiry: {
      type: Date,
      default: null,
    },
      deliveryVerified: {
      type: Boolean,
      default: false,
    },
    deliveredAt:{
      type:Date,
      default:null
    },
    cancelReason: {
      type: String,
      enum: [
        "Changed my mind",
        "Ordered by mistake",
        "Found another tailor",
        "Delivery is taking too long",
        "Other",
      ],
      default: null,
    },

    cancelledBy: {
      type: String,
      enum: ["customer", "tailor"],
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export { Order };
