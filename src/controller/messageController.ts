import { Request, Response } from "express";
import Message from "../model/messageModel";

export const createMessage = async (req: Request, res: Response) => {
    try {
        const {chatId, content, senderId} = req.body
        console.log("🚀 ~ createMessage ~ b̥ody:", req.body)

        await new Message({
            chatId,
            senderId,
            content,
            date: Date.now()
        }).save()

        const allMessages = await Message.find({chatId: chatId})

        res.status(200).json({success: true, allMessages, chatId})
    } catch (error:any) {
        console.log("create message controller error",error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}

export const getAllMessages = async(req: Request, res: Response) => {
    try {
        const {chatId}=req.params

        const allMessages = await Message.find({chatId: chatId})
        
        res.status(200).json({success: true, allMessages, chatId})

    } catch (error: any) {
        console.log("Get all message error",error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
}   