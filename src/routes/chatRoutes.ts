import express from 'express'
import { createChatRoom, getAllUsers } from '../controller/chatController';

const router = express.Router();

router.route('/get-all-users').get(getAllUsers)

router.route('/create-chat-room').post(createChatRoom)

export default router