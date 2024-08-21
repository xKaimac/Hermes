import { Server } from "socket.io";

let io: Server;
const userSocketMap = new Map<string, string>();

export const initializeSocket = (socketIo: Server) => {
  io = socketIo;

  io.on("connection", (socket) => {
    socket.on("authenticate", (data: { userId: string }) => {
      userSocketMap.set(data.userId, socket.id);
      socket.join(data.userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          socket.leave(userId);
          break;
        }
      }
    });
  });
};

export const emitFriendRequest = (recipientId: string, senderId: string) => {
  io.to(recipientId).emit("friendRequest", {
    type: "friendRequest",
    senderId: senderId,
  });
};

export const emitNewChat = (participants: string[], chatData: any) => {
  participants.forEach((userId) => {
    io.to(userId).emit("newChat", chatData);
  });
};

export const emitNewMessage = (participants: string[], messageData: any) => {
  participants.forEach((userId) => {
    io.to(userId).emit("newMessage", messageData);
  });
};
