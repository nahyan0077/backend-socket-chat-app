import { Request, Response } from "express";
import User from "../model/userModel";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, email, password } = req.body;

		const userExist = await User.findOne({ email });

		if (userExist) {
			throw new Error("user already exists");
		} else {
			const newUser: any = new User({
				username,
				email,
				password,
				joinedDate: Date.now(),
			});

			const savedUser = await newUser.save();

			const jwt_secret = process.env.JWT_SECRET;

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
			res.cookie("token", token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24,
			});

			res
				.status(200)
				.json({ success: true, message: "User created successfully", newUser });
		}
	} catch (error: any) {
		console.error("sign up controller error", error?.message);
		res.status(500).json({ success: false, error: error?.message });
	}
};

export const fetchUserData = async (req: Request, res: Response) => {
	try {
		let token = req.cookies.token;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No token provided" });
		}
		const jwt_secret = process.env.JWT_SECRET;

		if (!jwt_secret) {
			throw new Error("JWT_SECRET environment variable is not defined.");
		}

		const decoded = jwt.verify(token, jwt_secret);

		if (typeof decoded === "object" && decoded.hasOwnProperty("_id")) {
			const user = await User.findById(decoded._id);
			if (!user) {
				throw new Error("User not found");
			}

			res.status(200).json({
				success: true,
				message: "User data fetched successfully",
				user,
			});
		} else {
			throw new Error("Invalid token");
		}
	} catch (error: any) {
		console.error("fetch-user-data controller error", error?.message);
		res.status(500).json({ success: false, error: error?.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const userExist = await User.findOne({ email });
		if (!userExist) {
			throw new Error("User does't exists, please signup");
		}
		const passwordMatch = await bcrypt.compare(password, userExist.password);

		if (!passwordMatch) {
			throw new Error("password doesnt match");
		}

		const jwt_secret = process.env.JWT_SECRET;

		if (!jwt_secret) {
			throw new Error("JWT_SECRET environment variable is not defined.");
		}

		const token = jwt.sign(
			{
				username: userExist.username,
				email: userExist.email,
				_id: userExist._id,
			},
			jwt_secret
		);

		res
			.cookie("token", token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24,
			})
			.status(200)
			.json({ success: true, message: "Login successful",userExist });
	} catch (error: any) {
		console.error("Error occurred during sign-up:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error?.message,
		});
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("token").send({ message: "user logout" });
	} catch (error: any) {
		console.log(error);
	}
};
