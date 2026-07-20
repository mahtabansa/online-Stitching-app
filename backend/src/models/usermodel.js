import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    default:null
  },
  phone: {
    type: Number,
    required: true,
    min:10
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min:4
  },
  address: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  role:{
    type:String,
    enum:["customer","tailor"],
    required:true
  },
  isOnline:{type:Boolean,default:false},
  isShopCreated:{type:Boolean,default:false}
},{timestamp:true});

const User = mongoose.model("User", userSchema);
export { User };
