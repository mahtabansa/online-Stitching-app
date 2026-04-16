import { Item } from "../models/item.model.js";
import { Shop } from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

export const createItem = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    console.log("name, price, description, shopId", name, price, description);
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate("items");
    console.log("shop", shop);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const updatedData = { name, price, description, shop: shop._id };

    let image;

    if (req.file) {
      image = req.file.path;
      updatedData.image = image;
      const uploadedImage = await uploadOnCloudinary(image);
      updatedData.image = uploadedImage;
    }

    const newItem = await Item.create(updatedData);
    console.log("newItem", newItem);
    shop.items.push(newItem._id);
    await shop.save();
    await shop.populate({
      path: "owner items",
      Options: { sort: { updatedAt: -1 } },
    });

    return res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getMyShopItem = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const item = await Item.find();

//     const updatedData = { name, price, description, shop: shopId };

//     let image;

//     if (req.file) {
//       image = req.file.path;
//       updatedData.image = image;
//       const uploadedImage = await uploadOnCloudinary(image);
//       updatedData.image = uploadedImage;
//     }

//     const shop = await Shop.findOne({ owner: shopId }).populate("items");
//     console.log("shop", shop);
//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     const newItem = await Item.create(updatedData);
//     shop.items.push(newItem);
//     await shop.save();
//     return res
//       .status(201)
//       .json({ message: "Item created successfully", item: newItem });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const EditItem = async (req, res) => {
  try {
    const ItemId = req.params.id;

    const { name, price, description } = req.body;

    const updateData = { name, price, description };

    if (req.file) {
      updateData.image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      ItemId,
      updateData,
      { name, price, description },
      { new: true },
    );

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

    return res.status(200).json(shop);
  } catch (err) {
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
