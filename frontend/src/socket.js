
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
})


export function registerSocketUser(userId) {
  if (!userId) return;

  if (socket.connected) {
    socket.emit('registerUser', userId);
  } else {
    socket.once('connect', () => {
      socket.emit('registerUser', userId);
    });
  }
}

export function registerSocketOwner(ownerId) {
  if (!ownerId) return;

  if (socket.connected) {
    socket.emit('registerOwner', ownerId);
  } else {
    socket.once('connect', () => {
      socket.emit('registerOwner', ownerId);
    });
  }
}



export {socket}
