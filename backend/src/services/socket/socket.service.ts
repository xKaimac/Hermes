import { Server } from 'socket.io';

import { ChatValues } from '../../../../shared/types/ChatValues';
import { Message } from '../../../../shared/types/Message';

let io: Server;
const userSocketMap = new Map<number, string>();

export const initializeSocket = (socketIo: Server) => {
  io = socketIo;

  io.on('connection', (socket) => {
    socket.on('authenticate', (data: { user_id: number }) => {
      userSocketMap.set(data.user_id, socket.id);
      socket.join(data.user_id.toString());
    });

    socket.on('disconnect', () => {
      for (const [user_id, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(user_id);
          socket.leave(user_id.toString());
          break;
        }
      }
    });
  });
};

export const emitFriendRequest = (recipientId: number, senderId: string) => {
  io.to(recipientId.toString()).emit('friendRequest', {
    type: 'friendRequest',
    senderId: senderId,
  });
};

export const emitNewChat = (members: number[], chatData: ChatValues) => {
  members.forEach((user_id) => {
    io.to(user_id.toString()).emit('newChat', chatData);
  });
};

export const emitNewMessage = (members: number[], messageData: Message) => {
  members.forEach((user_id) => {
    io.to(user_id.toString()).emit('newMessage', messageData);
  });
};
