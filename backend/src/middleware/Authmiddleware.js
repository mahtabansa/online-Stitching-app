import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const authentication = (req, res,next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "token is not veryfied" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  

    if (!decodeToken) {
      return res
        .status(400)
        .json({ message: `decode Token does not verified` });
    }
    
     req.userId = decodeToken.userId;
    
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: `error in the auth middleware ${err}` });
  }
};
