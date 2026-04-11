import {Shop} from "../models/shop.model.js";
import UploadOnCloudinary from "../utils/Cloudinary.js";

const createEditShop = async (req, res) => {
  try {
    const { name, state, city, address } = req.body;

    const updatedData = { name, state, city, address };

    let image;

    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
      updatedData.image = image;
    }

    // update existing shop
    let shop = await Shop.findOneAndUpdate({ owner: req.userId }, updatedData, {
      new: true,
    });

    // If not exist → create
    if (!shop) {
      shop = await Shop.create({
        ...updatedData,
        owner: req.userId,
      });
    }

    res.json(shop);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).send(err.message);
  }
};

export { createEditShop };


const getMyShop = async (req, res) => {
  try {
  
     const userId = req.userId;

    // update existing shop
    let shop = await Shop.find({ owner: req.userId }).populate("owner items");

    if(!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (err) {
    console.log("error:", err);
    res.status(500).send(err.message);
  }
};

export { getMyShop };





const getShopsInMyCity = async (req, res) => {
  try {
    let { city } = req.params;
   
    const shop = await Shop.find({
      city: { $regex: `^${city}$`, $options: "i" },
    }).populate("owner");

    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    return res.status(200).json({shop

    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error occurred while get shop By city", err });
  }
};

export { getShopsInMyCity };

