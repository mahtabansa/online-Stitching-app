import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  
  },
  description: {
    type: String,
  },
  
},{timestamps: true});

const Item = mongoose.model("Item",ItemSchema);
export {Item}

