import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


// ✅ config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ upload function
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const fixedPath = filePath.replace(/\\/g, "/");

    const result = await cloudinary.uploader.upload(fixedPath, {
      folder: "shops",
    });

    // ✅ upload success
    if (result?.secure_url) {
      console.log("Upload successful:", result.secure_url);

      // local file delete
      fs.unlinkSync(fixedPath);

      return result.secure_url;
    }

    return null;

  } catch (err) {
    console.error("Cloudinary upload error:", err);

    // ❗ fail hone par bhi delete karo
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;