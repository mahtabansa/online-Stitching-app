import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express'
import mongoose from 'mongoose';
import { authRouter } from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { userRouter } from './routes/user.route.js';
import { shopRouter } from './routes/shop.route.js';
import { itemRouter } from './routes/item.route.js';
import { orderRouter } from './routes/order.route.js';

const app = express();
const port  = process.env.PORT || 8001
app.use(cors({
  origin:'http://localhost:5173',
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}))
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use('/api/auth',authRouter , express.static("public"));
app.use('/api/user',userRouter);
app.use('/api/shops',shopRouter);
app.use('/api/items',itemRouter);
app.use('/api/order',orderRouter);


app.listen(port,()=> {
      console.log(`server is running on port ${port}`);
       mongoose.connect(process.env.MONGO_URL);
     console.log("mongoDB connected");
})