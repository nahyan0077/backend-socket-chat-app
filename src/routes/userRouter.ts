import express from "express";
import { fetchUserData, login, logout, signUp } from "../controller/userController";

const router = express.Router();

router.route("/sign-up").post(signUp);

router.route("/fetch-user-data").get(fetchUserData);

router.route('/log-in').post(login)

router.route('/log-out').get(logout)

export default router;
