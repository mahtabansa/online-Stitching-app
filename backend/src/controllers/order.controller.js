import { Order } from "../models/order.model.js";
import { User } from "../models/usermodel.js";
import { Shop } from "../models/shop.model.js";
import { generateOtp } from "../utils/otpHelper.js";
import { changeOrderStatus } from "../utils/changeOrderStatus.js";
import { getIO } from "../socket/socketHandler.js";

const Createorder = async (req, res) => {
  try {
    const {
      CheckOutItem,
      totalAmount,
      deliveryAddress,
      latitude,
      longitude,
      StitchingMethod,
    } = req.body;

    // Step 1: Grouping

    if (!CheckOutItem) {
      return res
        .status(500)
        .json({ message: `empty item  can not be  order ` });
    }
    const groupItemByShop = {};
    CheckOutItem.forEach((item) => {
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
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user")
      .populate("shopOrder.shop")
      .populate("shopOrder.owner")
      .populate("shopOrder.shopOrderItems.item");
      console.log(populatedOrder, "populatedOrder");
    // sirf us shop ke owner ko notify karo jiska order hai
    populatedOrder.shopOrder.forEach((shopOrder) => {
      console.log("shopOrder",shopOrder);
      const ownerId = shopOrder.owner._id.toString();

      // // ✅ Debug: check karo room me koi socket hai ya nahi
      // const room = getIO().sockets.adapter.rooms.get(`user_${ownerId}`);
 
      getIO()
        .to(`owner_${ownerId}`)
        .emit("newOrder", {
          ownerId,
           order: populatedOrder,
        });
    });

    return res
      .status(200)
      .json({ message: "Order placed successfully", order: populatedOrder });
  } catch (err) {
    console.log("error while create Order", err);

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
      let orders = await Order.find({ user: userid })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name image ")
        .populate("shopOrder.owner", "name email phone image")
        .populate(
          "shopOrder.shopOrderItems.item",
          "name image description price ",
        );
      orders = orders.sort((a, b) => {
        if (a.status === "cancelled" && b.status !== "cancelled") return 1;
        if (a.status !== "cancelled" && b.status === "cancelled") return -1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return res.status(200).json({ orders });
    } else if (user.role === "tailor") {
      let orders = await Order.find({ "shopOrder.owner": userid })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("shopOrder.shopOrderItems.item", "name image price");

      orders = orders.sort((a, b) => {
        if (a.status === "cancelled" && b.status !== "cancelled") return 1;
        if (a.status !== "cancelled" && b.status === "cancelled") return -1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return res.status(200).json({ orders });
    }
  } catch (err) {
    res.status(500).json({ message: "error in getting orders", err });
  }
};

export { getMyOrders };

export const CancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { cancelReason, customReason } = req.body;

    const order = await Order.findByIdAndUpdate(orderId);

    if (
      order.status === "stitching" ||
      order.status === "out of delivery" ||
      order.status === "delivered"
    ) {
      return res.status(400).json({
        message:
          "order can not be cancelled while stitching ,out of delivery, delivered ",
      });
    } else {
      if (order) {
        order.status = "cancelled";
        order.cancelReason = cancelReason;
        order.customReason = customReason;
        order.cancelledBy = "customer";
        order.cancelledAt = new Date();

        await order.save();
      }
      console.log("order in the cancel order", order);

      console.log("order in the cancel order", order.shopOrder.owner);

      getIO().to(`owner_${order.shopOrder.owner}`).emit("orderStatusUpdate", {
        orderId: order._id,
        status: order.status,
      });

      res.json({
        success: true,
        message: "Order cancelled successfully",
      });
    }
  } catch (error) {
    console.log("error in cancelling user order ", error);
  }
};

export const AcceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order already accepted ya invalid stage mein hai" });
    }

    await changeOrderStatus(order, "accepted", "Order accepted by shop owner");

    getIO()
      .to(`user_${order.user}`) // ✅ customerId ki jagah user
      .emit("handleAccept", {
        orderId: order._id,
        status: order.status,
      });

    res.json({ success: true, message: "Order accepted", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================== STEP 2: Save Pickup Time ==================
export const savePickupTime = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pickupTime } = req.body;

    if (!pickupTime)
      return res.status(400).json({ message: "Pickup time is required" });

    const order = await Order.findById(orderId).populate("shopOrder.owner");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "accepted") {
      return res.status(400).json({ message: "Order is not accepted yet" });
    }

    if (order.shopOrder?.[0]) {
      order.shopOrder[0].pickup = pickupTime;
    }

    await order.save();

    // Owner(s) ko batao
    console.log("save time for order", order);
    order.shopOrder.forEach((shopOrder) => {
      const ownerId = shopOrder.owner._id.toString();
      console.log("ownerId", ownerId);
      getIO().to(`owner_${ownerId}`).emit("pickupTimeUpdate", {
        orderId: order._id,
        pickupTime: shopOrder.pickup,
        order: order,
      });
    });

    // User (customer) ko bhi batao
    getIO().to(`user_${order.user}`).emit("pickupTimeUpdate", {
      orderId: order._id,
      pickupTime: order.shopOrder[0].pickup,
    });

    res.json({ success: true, message: "Pickup time saved", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================== STEP 3: Generate Pickup OTP (owner side trigger) ==================

export const sendPickupOtp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Order is not in the accepted stage" });
    }

    const otp = generateOtp();
    order.pickupOtp = otp;
    order.pickupOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry time
    await order.save();

    getIO().to(`user_${order.user}`).emit("pickupOtpGenerated", {
      orderId: order._id,
      pickupOtp: order.pickupOtp, // agar security concern hai to ye field mat bhejo
      pickupOtpExpiry: order.pickupOtpExpiry,
    });

    res.json({
      success: true,
      message: "Pickup OTP generated, otp sent to the customer",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================== STEP 4: Owner Verify Pickup OTP → status = stitching ==================
export const verifyPickupOtp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.pickupOtp || order.pickupOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > order.pickupOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expire ho gaya, dobara generate karo",
      });
    }

    await changeOrderStatus(
      order,
      "stitching",
      "Order moved to stitching after pickup verification",
    );

    order.isOtpVerified = true;
    order.pickupVerifiedAt = Date.now();
    order.pickupOtp = undefined;
    order.pickupOtpExpiry = undefined;
    await order.save();
    getIO().to(`user_${order.user}`).emit("verifyPickupOtp", {
      orderId: order._id,
      isOtpVerified: order.isOtpVerified,
      pickupOtp: order.pickupOtp,
      pickupOtpExpiry: order.pickupOtpExpiry,
      status: order.status,
    });
    res.json({
      success: true,
      message: "Pickup verified, order is stitching now",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// ================== STEP 5: Generate Delivery OTP ==================
export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!orderId) {
      return res.status(404).json({ message: "OrderId is required" });
    }
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    } else if (order.status === "delivered") {
      return status(500).json({ message: "order is already delivered" });
    } else if (
      order.status !== "stitching" &&
      order.status !== "out of delivery"
    ) {
      return res.status(400).json({
        message:
          "Order is not in delivery stage,please make order out of delivery first",
      });
    }

    if (order.status === "stitching") {
      await changeOrderStatus(
        order,
        "out of delivery",
        "Stitching complete, ready for delivery",
      );
    }

    const otp = generateOtp();
    order.deliveryOtp = otp;
    order.deliveryOtpExpiry = Date.now() + 10 * 60 * 1000;
    await order.save();

    getIO().to(`user_${order.user}`).emit("deliveryOtpGenerated", {
      orderId: order._id,
      deliveryOtp: order.deliveryOtp, // agar security concern hai to ye field mat bhejo
      pickupOtpExpiry: order.pickupOtpExpiry,
      status: order.status,
    });

    res.json({
      success: true,
      message: "Delivery OTP generated, customer apni screen pe dekh sakta hai",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================== STEP 6: Owner Verify Delivery OTP → status = delivered ==================
export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;
    console.log(
      "verifyDeliveryOtp called with orderId:",
      orderId,
      "and otp:",
      otp,
    );

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.deliveryOtp || order.deliveryOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > order.deliveryOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expire ho gaya, dobara generate karo",
      });
    }

    order.deliveryVerified = true;
    order.deliveredAt = Date.now();
    order.deliveryOtp = undefined;
    order.deliveryOtpExpiry = undefined;
    await changeOrderStatus(order, "delivered", "Delivery OTP verified");

    await order.save();

    getIO().to(`user_${order.user}`).emit("verifyOtpConfirmation", {
      orderId: order._id,
      deliveryOtp: order.deliveryOtp, // agar security concern hai to ye field mat bhejo
      pickupOtpExpiry: order.pickupOtpExpiry,
      deliveryVerified: order.deliveryVerified,
      deliveredAt: order.deliveredAt,
      status: order.status,
    });

    res.json({ success: true, message: "Order delivered successfully", order });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const UpdateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ FIX: condition ulti thi — "!=" honi chahiye, "==" nahi
    if (order.status === "pending" || order.status === "delivered") {
      return res.status(400).json({
        message: `order can not be delivered before otp verification`,
      });
    }
    if (order.status === "stitching" && status === "accepted") {
      return res.status(402).json({ message: `order is already accepted ` });
    }

    if (order.status === "out of delivery" && status === "stitching") {
      return res.status(402).json({ message: `order is out of delivery ` });
    }

    await changeOrderStatus(order, status, "Order is out of delivery");
    getIO().to(`user_${order.user}`).emit("orderStatusUpdate", {
      orderId: order._id,
      status: order.status,
    });

    res.json({ success: true, message: "Order is out of delivery", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
