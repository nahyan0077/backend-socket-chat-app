import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
	{
		chatId: mongoose.Schema.Types.ObjectId,
		senderId: mongoose.Schema.Types.ObjectId,
		content: String,
		date: Date,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("messages", messageModel);