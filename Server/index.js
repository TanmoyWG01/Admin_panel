import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import router from "./routes/routes.js";
import UserRoute from "./routes/UserRoute.js"
import ChatRoute from "./routes/ChatRoutes.js";
import MessageRoute from "./routes/MessageRoute.js"
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 8080;
const url = process.env.MONGO_URL;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/thumbnails")));

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB Database!");
  } catch (err) {
    throw err;
  }
};

// Middleware to parse incoming request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Routes
app.use("/", router);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/users", UserRoute)

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Add more socket event listeners here
});

// Start the server
server.listen(PORT, (req, res) => {
  connectToDatabase();
  console.log(`Server running on port ${PORT}....`);
});
