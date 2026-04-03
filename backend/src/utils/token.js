import { configDotenv } from "dotenv";
configDotenv();
import jwt from "jsonwebtoken";

export const createToken = (userId) => {
  try {
    return ( 
      jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "3days" })
);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `error in the create token ${err}` });
  }
};
