import { Socket, Server } from "socket.io";
import { Request, Response } from "express";
import User from "../model/userModel";
import chatRoom from "../model/chatModel";
import { v4 as uuidv4 } from "uuid";

declare global {
	namespace NodeJS {
		interface Global {
			onlineUsers: Map<string, string>; // Adjust the types accordingly
			chatSocket?: Socket;
		}
	}
}

declare global {
	var onlineUsers: Map<any, any>;
}

global.onlineUsers = new Map<string, string>();
let onlineUsersList: { userId: string; socketId: string }[] = [];

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const allUsers = await User.find();
		res.status(200).json({
			success: true,
			data: allUsers,
			message: "All users data fetched",
		});
	} catch (error: any) {
		res.status(500).json({ success: false, message: "Failed to fetch users" });
	}
};

export const chatController = (io: Server) => {
	try {
		io.on("connection", (socket) => {
			socket.on("add-online-users", (userId: string) => {
				onlineUsers.set(userId, socket.id);

				const existingUser = onlineUsersList.find(
					(user) => user.userId === userId
				);

				if (!existingUser) {
					onlineUsersList.push({
						userId,
						socketId: socket.id,
					});
				}

				io.emit("getOnlineUsers", onlineUsersList);
			});

			socket.on("send-message", (data: any) => {
				const user = onlineUsersList.find(
					(user) => user.userId === data.receiverId
				);

				const uuid = uuidv4();

				const receiverDatas = {
					_id: uuid,
					chatId: data.chatId,
					content: data.content,
					senderId: data.senderId,
					createdAt: new Date(),
					updatedAt: new Date(),
					date: new Date(),
				};

				if (user) {
					io.to(user.socketId).emit("get-messages", receiverDatas);
				}
				
			});

			socket.on("typing",(data: any) => {
				console.log(data,"typing");
				const user = onlineUsersList.find((user)=>user.userId == data.receiverId)
				console.log(user,"online or not");
				if(user){
					io.to(user.socketId).emit("typing",data)
				}
				
			})

			// Handle disconnection
			socket.on("disconnect", () => {
				onlineUsersList = onlineUsersList.filter(
					(user) => user.socketId !== socket.id
				);

				io.emit("getOnlineUsers", onlineUsersList);
			});
		});
	} catch (error: any) {
		console.error("Error in chatController:", error);
	}
};

export const createChatRoom = async (req: Request, res: Response) => {
	try {
		const { sender_id, reciver_id } = req.body;

		const existingChat = await chatRoom.findOne({
			members: { $all: [sender_id, reciver_id] },
		});

		const reciversData = await User.findById(reciver_id);

		if (existingChat) {
			return res
				.status(200)
				.json({ success: true, reciversData, chatRoom: existingChat });
		}

		const newChat = await new chatRoom({
			members: [sender_id, reciver_id],
		}).save();

		res.status(200).json({
			success: true,
			reciversData,
			chatRoom: newChat,
			message: "Chat room created",
		});
	} catch (error: any) {
		console.log(error);
		res.status(400).json({ status: false, err: error.message });
	}
};
