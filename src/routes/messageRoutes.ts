import express from 'express'
import { createMessage, getAllMessages } from '../controller/messageController'

const router = express.Router()

router.route('/create-message').post(createMessage)

router.route('/get-all-messages/:chatId').get(getAllMessages)

export default router


