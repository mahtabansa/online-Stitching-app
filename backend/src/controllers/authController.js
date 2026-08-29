import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { getIO } from "../socket/socketHandler.js";

export const signup = async (req, res, next) => {
  const { name, phone, email, password, role } = req.body;

  try {
    if (!name || !phone || !email || !password || !role) {
      return res.json({ message: "all filled required" });
    }
    if (password.length <= 4) {
      return res
        .status(422)
        .json({ message: `password should be minimum six character` });
    }

    if (phone.length !== 10) {
      return res
        .status(422)
        .json({ message: `please give valid phone number` });
    }

    let user = await User.findOne({ email });
   
    if (user) {
      return res
        .status(409)
        .send({ message: "user already exist please,login" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    if (!hashPassword) {
      return res.status(500).json({ message: "error in hashing the password" });
    }

    user = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
      role,
    });

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "user resister successfully" });
    next();
  } catch (err) {
    console.log("Error in the register", err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }
  
    if (password.length < 6) {
      return res
        .status(422)
        .json({ message: `password must be greater than 6` });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hashPassword = await bcrypt.compare(req.body.password, user.password);

    if (!hashPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        image: user.image,
      },
    });

    next();
  } catch (err) {
    console.log("error occurs during login", err);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    return res.status(500).json({ message: `SignOut error: ${err.message}` });
  }
};

export { logout };

const AddImage = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(404).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadOnCloudinary(req.file.path);

    if (!imageUrl) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true },
    );
    getIO(`user_${userId}`).emit("updateOwnerProfileImage", {
      user: updatedUser,
    });

    return res.status(200).json({
      message: "Image uploaded",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export { AddImage };
