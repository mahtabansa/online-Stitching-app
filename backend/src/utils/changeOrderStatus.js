import { getIO } from "../socket/socketHandler.js";

export const changeOrderStatus = async (order, newStatus, note = "") => {
  if (!order || !newStatus) {
    throw new Error(`Invalid order or status: ${order?.status} → ${newStatus}`);
  }
  order.status = newStatus;

  await order.save();
  return order;
};