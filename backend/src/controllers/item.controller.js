import { Item } from "../models/item.model.js";
import { Shop } from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { getIO } from "../socket/socketHandler.js";

export const createItem = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name) return res.status(422).json({ message: "name is required" });
    if (!price) return res.status(422).json({ message: "price is required" });
    if (!description)
      return res.status(422).json({ message: "description is required" });

    const shop = await Shop.findOne({ owner: req.userId }).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "please ,create shop first" });
    }

    const updatedData = { name, price, description, shop: shop._id };
    console.log("req.file",req.files)
    if (!req.files || req.files.length === 0) {
      return res
        .status(422)
        .json({ message: "at least one image is required" });
    }

    // Upload all images to cloudinary in parallel
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadOnCloudinary(file.path)),
    );

    // Check if any upload failed
    if (uploadedImages.some((img) => !img)) {
      return res.status(500).json({ message: "please, try again" });
    }

    updatedData.image = uploadedImages; // array of URLs
    console.log("updated data image",updatedData)
    const newItem = await Item.create(updatedData);
    shop.items.push(newItem._id);
    await shop.save();
    await shop.populate({
      path: "owner items",
      options: { sort: { updatedAt: -1 } },
    });

    return res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const EditItem = async (req, res) => {
  try {
    const ItemId = req.params.id;
    const { name, price, description, existingImages } = req.body;

    const updateData = { name, price, description };

    if (!name) return res.status(422).json({ message: "name is required" });
    if (!price) return res.status(422).json({ message: "price is required" });
    if (!description)
      return res.status(422).json({ message: "description is required" });

    let keptImages = [];
    if (existingImages) {
      try {
        keptImages = JSON.parse(existingImages);
      } catch (err) {
        keptImages = [];
      }
    }

    let newUploadedImages = [];
    if (req.files && req.files.length > 0) {
      newUploadedImages = await Promise.all(
        req.files.map((file) => uploadOnCloudinary(file.path)),
      );

      if (newUploadedImages.some((img) => !img)) {
        return res.status(500).json({ message: "please, try again" });
      }
    }

    const finalImages = [...keptImages, ...newUploadedImages].slice(0, 3);

    if (finalImages.length > 0) {
      updateData.image = finalImages;
    }

    const item = await Item.findByIdAndUpdate(ItemId, updateData, {
      new: true,
    });

    if (!item) {
      return res.status(500).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    if (!shop) {
      return res
        .status(401)
        .json({ message: "shop not found error in editItem controller" });
    }

    getIO().to(`user_${shop.owner}`).emit("EditItem", {
      ItemId: item._id,
      shopId: shop._id,
      Item: item,
    });

    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error occured while edit item" });
  }
};
export { EditItem };

const DeleteItem = async (req, res) => {
  try {
    const ItemId = req.params.id;

    const item = await Item.findByIdAndDelete(ItemId);

    if (!item) {
      return res.status(404).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i.toString() !== item._id.toString());

    shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(item);
  } catch (err) {
    return res.status(500).json({ message: "error occured while Delete item" });
  }
};
export { DeleteItem };

const getItemInmyCity = async (req, res) => {
  try {
    const { city } = req.params;
    const item = await Item.findOne();

    const shops = await Shop.find({
      city: { $regex: `^${city}$`, $options: "i" },
    }).populate("items");

    if (shops.length === 0) {
      return res.status(404).json({ message: "shops not found in your city" });
    }

    // saare items ek array me nikaal lo
    const items = shops.flatMap((shop) => shop.items);

    if (items.length === 0) {
      return res.status(404).json({ message: "item not found in your city" });
    }

    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ message: "error occured" });
  }
};
export { getItemInmyCity };

export const searchItem = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) return;

    console.log("query, city", query, city);

    const searchShops = await Shop.find({
      city: { $regex: city, $options: "i" },
    }).populate("items");


    if (searchShops.length == 0) {
      return res.status(404).json({ message: "shop not found" });
    }

    const shopIds = searchShops.map((i) => i._id);

    const searchResults = await Item.find({
      shop: { $in: shopIds },
      $or: [{ name: { $regex: query, $options: "i" } }],
    })
      .populate("shop")
      .populate("name")
      .populate("image");

    if (searchResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found for your search",
      });
    }

    return res.status(200).json({
      success: true,
      searchResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
