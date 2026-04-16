import { Order } from "../models/order.model.js";
import { User } from "../models/usermodel.js";
import { Shop } from "../models/shop.model.js";
// const Createorder = async (req, res) => {
//   // try {
//   //   const userId = req.userId;
//   //   const {
//   //     ItemCard,
//   //     longitude,
//   //     latitude,
//   //     deliveryAddress,
//   //     totalAmount,
//   //     StitchingMethod,
//   //   } = req.body;
//   //   console.log("req.body", req.body);

//   //   if (
//   //     !ItemCard  ||
//   //     !totalAmount ||
//   //     !deliveryAddress ||
//   //     !StitchingMethod
//   //   ) {
//   //     return res.status(400).json({ message: "Card is empty " });
//   //   }

//   //   // const formdata = {
//   //   //   user: req.userId,
//   //   //   longitude,
//   //   //   latitude,
//   //   //   deliveryAddress,
//   //   //   totalAmount,
//   //   //   StitchingMethod,
//   //   // };

//   //   const groupItemByshop = {} ; // mai yahan par sabhi items ke liye shopId ko store
//   //   // kar rha hu ekk obeject ke andar jismai shopId or item rahega

//   //   ItemCard.forEach((item) => {
//   //     const shopId = item.shop;
//   //     if (!groupItemByshop[shopId]) {
//   //       groupItemByshop[shopId] = [];
//   //     }
//   //     groupItemByshop[shopId].push(item);
//   //   });

//   //   // Object.entries(groupItemByShop)
//   //   //  [
//   //   //   ["shop123", [item1, item2]],
//   //   //   ["shop456", [item3]],
//   //   //   ["shop789", [item4, item5, item6]]
//   //   // ]

//   //   const shopOrders = await Promise.all(
//   //     Object.entries(groupItemByShop).map(async ([shopId, items]) => {
//   //       // ✅ destructure directly
//   //       const shop = await Shop.findById(shopId).populate("owner");
//   //       if (!shop) {
//   //     throw new Error(`Shop with id ${shopId} not found`);
//   //   }

//   //       const subtotal = items.reduce(
//   //         (sum, item) => sum + Number(item.price) * Number(item.quantity),
//   //         0,
//   //       );

//   //       return {
//   //         shop: shop._id,
//   //         owner: shop.owner._id,
//   //         subtotal,
//   //         shopOrders: items.map((item) => ({
//   //           item: item._id,
//   //           price: item.price,
//   //           quantity: item.quantity,
//   //           name: item.name,
//   //         })),
//   //       };
//   //     }),
//   //   );

//   //   const newOrder = new Order({
//   //     user: req.userId,
//   //     longitude,
//   //     latitude,
//   //     deliveryAddress,
//   //     totalAmount,
//   //     StitchingMethod,
//   //     shopOrder: shopOrders, // ✅ already resolved, no Promise.all needed
//   //   });

//   //   await newOrder.save();

//   //   return res
//   //     .status(200)
//   //     .json({ message: "Order placed successfully", order: newOrder });
//   // } catch (err) {
//   //   console.log("error while create Order", err);
//   //   return res.status(500).json({ message: `error while create Order ${err}` });
//   // }

// };

const Createorder = async (req, res) => {
  try {
    const {
      ItemCard,
      totalAmount,
      deliveryAddress,
      latitude,
      longitude,
      StitchingMethod,
    } = req.body;

    // Step 1: Grouping
    const groupItemByShop = {};
    ItemCard.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemByShop[shopId]) {
        groupItemByShop[shopId] = [];
      }
      groupItemByShop[shopId].push(item);
    });
    console.log("Shop IDs from request:", Object.keys(groupItemByShop));

    // Step 2: shopOrders banao
    const shopOrders = await Promise.all(
      Object.entries(groupItemByShop).map(async ([shopId, items]) => {
        console.log("Finding shop with id:", shopId);
        const shop = await Shop.findById(shopId).populate("owner");
        console.log("shop:", shop);

        // ✅ res.json() nahi — throw karo, catch block handle karega
        if (!shop) {
          throw new Error(`Shop with id ${shopId} not found`);
        }

        const subtotal = items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0,
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((item) => ({
            item: item._id,
            price: item.price,
            quantity: item.quantity,
            name: item.name,
          })),
        };
      }),
    );

    // Step 3: Order save karo
    const newOrder = new Order({
      user: req.userId,
      longitude,
      latitude,
      deliveryAddress,
      totalAmount,
      StitchingMethod,
      shopOrder: shopOrders,
    });

    await newOrder.save();
    console.log("newOrder", newOrder);
    return res
      .status(200)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.log("error while create Order", err);

    // ✅ Shop not found ke liye alag message
    if (err.message.startsWith("Shop with id")) {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: `error while create Order ${err}` });
  }
};
export { Createorder };

const getMyOrders = async (req, res) => {
  try {
    const userid = req.userId;

    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "customer") {
      const orders = await Order.find({ user: userid })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name image ")
        .populate("shopOrder.owner", "name email mobile")
        .populate("shopOrder.shopOrderItems.item", "name image description price ");

      return res.status(200).json({ orders });
    } else if (user.role === "tailor") {
      const orders = await Order.find({ "shopOrder.owner": userid })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name image")
        .populate("user")
        .populate("shopOrder.shopOrderItems.item", "name image price")
        // .populate("shopOrder.assignedDeliveryBoy", "fullName mobile email");

      return res.status(200).json({ orders });
    }
  } catch (err) {
    res.status(500).json({ message: "error in getting orders", err });
  }
};

export {getMyOrders}
