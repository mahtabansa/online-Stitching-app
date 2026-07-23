
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
})

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

export function registerSocketUser(userId) {
  if (!userId) return;

  if (socket.connected) {
    socket.emit('registerUser', userId);
    console.log('Registered:', userId);
  } else {
    socket.once('connect', () => {
      socket.emit('registerUser', userId);
      console.log('Registered after connect:', userId);
    });
  }
}

export function registerSocketOwner(ownerId) {
  if (!ownerId) return;

  if (socket.connected) {
    socket.emit('registerOwner', ownerId);
    console.log('Owner Registered:', ownerId);
  } else {
    socket.once('connect', () => {
      socket.emit('registerOwner', ownerId);
      console.log('Owner Registered after connect:', ownerId);
    });
  }
}



export {socket}
