import { Socket, Server } from 'socket.io';

interface MessageData {
  sender: string;
  content: string;
}

export const chatController = async (io: Server) => {
  try {
    io.on('connection', (socket: Socket) => {
      console.log('A user connected', socket.id);

      // Handle incoming messages
      socket.on('message', (data: MessageData) => {
        console.log(`Received message from ${data.sender}: ${data.content}`);
        // Broadcast the message to all connected clients
        io.emit('message', data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  } catch (error: any) {
    console.error('Error in chatController:', error);
  }
};
