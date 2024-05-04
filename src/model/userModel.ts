import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		profile: {
			type: String,
			default: "https://github.com/shadcn.png",
		},
		joinedDate: {
			type: Date,
		},
		lastSeen: {
			type: Date,
		},
		isFirstTime: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save',async function (next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model('users',userSchema)
