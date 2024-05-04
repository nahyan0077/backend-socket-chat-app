import express, { Application } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { Socket, Server } from "socket.io";
import cors from "cors";
import http from 'http'

config();

const app: Application = express();
const PORT: number = Number(process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
	cors({
		credentials: true,
		// origin:process.env.CLIENT_URL,
		origin: ["http://localhost:3000"],
	})
);


// HTTP setup for socket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
  });

app.listen(PORT, () => {
	console.log(`Admin Service is listening to the port ${PORT}`);
});

export default app;
