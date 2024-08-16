import express, { Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { Socket, Server } from "socket.io";
import cors from "cors";
import http from 'http'
import { chatController } from "./controller/chatController";
import userRouter from './routes/userRouter'
import chatRouter from './routes/chatRoutes'
import messageRouter from './routes/messageRoutes'
import {connectDB} from './config/mongodb'
import cookieparser from 'cookie-parser'

config();
connectDB()

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieparser())


app.use(
	cors({
		credentials: true,
		origin: ["http://localhost:3000","https://flip-chat.vercel.app"]
	})
);

//user routes
app.use('/',userRouter)
app.use('/chats',chatRouter)
app.use('/message',messageRouter)

// HTTP setup for socket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000","https://flip-chat.vercel.app"],
		methods: ["GET", "POST"]
    },
  });


chatController(io)



server.listen(PORT, () => {
	console.log(`Admin Service is listening to the port ${PORT}`);
});

export default app;
