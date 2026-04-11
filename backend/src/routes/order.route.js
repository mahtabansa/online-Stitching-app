import { myorders } from "../controllers/order.controller";
import  express from express;
import { authentication } from "../middleware/Authmiddleware.js";

export const orderRouter = Router.express();
orderRouter.get('/get-my-orders',authentication,myorders)

