import mongoose from 'mongoose'
import {config} from 'dotenv'

config()

export const connectDB = async (): Promise <void> =>{

    try {

        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI environment variable is not defined.");
        }
        await mongoose.connect(mongoURI)
        
        console.log("🚀🚀🚀 Connected to Database 🚀🚀🚀")
        
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }

} 
    
