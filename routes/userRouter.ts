import express from 'express'
import { homePage } from '../controller/userController'


const router = express.Router()

router.route('/').get(homePage)

export default router