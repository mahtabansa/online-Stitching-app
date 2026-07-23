import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./routes/user.route.js";
import { shopRouter } from "./routes/shop.route.js";
import { itemRouter } from "./routes/item.route.js";
import { orderRouter } from "./routes/order.route.js";
import http from "http";
import { initSocket } from "./socket/socketHandler.js"; // Server import hata do, sirf ye rehne do
import { errorHandler } from "./middleware/errorHandler.js";
import {checkDbConnection} from './middleware/checkDbConnection.js'

const app = express();
const server = http.createServer(app);

const io = initSocket(server);

const port = process.env.PORT || 8001;
console.log("process.env.Frontend_URL",process.env.Frontend_URL)
app.use(
  cors({
    origin:process.env.Frontend_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("io", io); // ab initSocket wala io yahan set hoga

app.use(checkDbConnection);
app.use("/api/auth", authRouter, express.static("public"));
app.use("/api/user", userRouter);
app.use("/api/shops", shopRouter);
app.use("/api/items", itemRouter);
app.use("/api/order", orderRouter);
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // server start hi mat karo agar DB connect nahi hua
  }
};

startServer();

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});


mongoose.connection.on("reconnect", () => {
  console.log("MongoDB reconnect");
});
