import { Shop } from "../models/shop.model.js";
import UploadOnCloudinary from "../utils/Cloudinary.js";
import { getIO } from "../socket/socketHandler.js";
import { User } from "../models/usermodel.js";
const createEditShop = async (req, res) => {
  try {
    const { name, state, city, address } = req.body;
    const updatedData = { name, state, city, address };

    if (!name) return res.status(422).json({ message: `shop name is required` });
    if (!state) return res.status(422).json({ message: `state is required` });
    if (!city) return res.status(422).json({ message: `city is required` });
    if (!address) return res.status(422).json({ message: `address is required` });

    if (req.file) {
      updatedData.image = await UploadOnCloudinary(req.file.path);
    } else {
      return res.status(422).json({ message: `shop image is required` });
    }

    let shop = await Shop.findOneAndUpdate({ owner: req.userId }, updatedData, {
      new: true,
    }).populate("owner items");

    if (!shop) {
      shop = await Shop.create({ ...updatedData, owner: req.userId });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { isShopCreated: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    getIO().to(`owner_${shop.owner}`).emit("createEditShop", {
      shopId: shop._id,
      shop: shop,
      isShopCreated: updatedUser.isShopCreated,
    });

    return res.json(shop);
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export { createEditShop };

const getMyShop = async (req, res) => {
  try {
    const userId = req.userId;

    // update existing shop
    let shop = await Shop.find({ owner: req.userId }).populate("owner items");

    if (!shop) {
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
    })
      .populate("owner", "name image phone email ")
      .populate("items");
    //  console.log("shop ",shop)
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    return res.status(200).json({ shop });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error occurred while get shop By city", err });
  }
};

export { getShopsInMyCity };

export const fetchAllshops = async(req,res)=>{
  const shops = await Shop.find().populate("items owner");
  res.status(200).json(shops)
}
