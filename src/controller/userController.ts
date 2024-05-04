import { Request, Response } from "express";
import User from "../model/userModel";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config()

export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, email, password } = req.body;
		console.log("🚀 ~ signUp ~ password:", password);
		console.log("🚀 ~ signUp ~ username:", username);

		const userExist = await User.findOne({ email });

		if (userExist) {
			throw new Error("user already exists");
		} else {
			const newUser: any =  new User({
				username,
				email,
				password,
				joinedDate: Date.now(),
			});

			const savedUser = await newUser.save();

			const jwt_secret = process.env.JWT_SECRET

			if (!jwt_secret) {
				throw new Error("JWT_SECRET environment variable is not defined.");
			}

			const token = jwt.sign(
				{
					username: savedUser.username,
					email: savedUser.email,
					_id: savedUser._id,
				},
				jwt_secret
			);
			res
				.cookie("token", token, {
					httpOnly: true,
					maxAge: 1000 * 60 * 60 * 24,
				})
			delete newUser.password
			res.status(200)
				.json({ sucess: true, message: "User created successfully", newUser });
		}

		
	} catch (error: any) {
		console.error("sign up controller error",error?.message);
		res.status(500).json({ success:false, error: error?.message });
	}
};
