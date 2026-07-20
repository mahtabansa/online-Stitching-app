// middlewares/checkDbConnection.js
import mongoose from "mongoose";
 export const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Service temporarily unavailable. Please try again later.",
    });
  }
  next();
};

