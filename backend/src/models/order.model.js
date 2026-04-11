import mongoose, { Mongoose } from "mongoose";

const OrderSchema = new Mongoose({

});

const Order = mongoose.model("order",OrderSchema);
export {Order}