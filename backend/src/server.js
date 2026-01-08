// =======================
// 📦 LIBRARY IMPORTS
// =======================
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// =======================
// 🏠 LOCAL IMPORTS
// =======================
import { connectDB } from "../lib/db.js";
import { UserModel } from "../models/user.model.js";
import { handleSignUp } from "../controllers/auth.controller.js";
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import { expressServer, httpUpgradedServer, ioServer } from "./socket.js";

// =======================
// 🔐 ENV CONFIG
// =======================
// Load environment variables from .env file
dotenv.config();

// =======================
// 🧩 MIDDLEWARE SETUP
// =======================

// 🌍 Enable CORS for frontend requests
expressServer.use(
  cors({
    origin: process.env.FRONTEND_URL, // 🎯 Exact frontend domain (Vercel)
    credentials: true,               // 🍪 Allow cookies (auth/session)
  })
);

// 🧠 Parse incoming JSON payloads
expressServer.use(express.json());

// 🍪 Parse cookies from requests
expressServer.use(cookieParser());

// =======================
// 🛣️ API ROUTES
// =======================

// 🔐 Auth-related routes (signup, login, logout, profile)
expressServer.use("/api/auth", authRoutes);

// 💬 Messaging-related routes (contacts, chats, messages)
expressServer.use("/api/message", messageRoutes);

// =======================
// 🧪 BASE ROUTE (HEALTH CHECK)
// =======================
expressServer.get("/", (req, res) => {
  res.send("HI SERVER");
});

// =======================
// 🚀 SERVER START
// =======================
const PORT = process.env.PORT;

// 🌐 Start HTTP + WebSocket server
httpUpgradedServer.listen(PORT, () => {
  console.log("🚀 THE SERVER RUNNING");

  // 🗄️ Connect to database once server is live
  connectDB();
});
