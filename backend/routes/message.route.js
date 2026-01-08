import express from "express";
import { MessageModel } from "../models/message.model.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  handleGetMessages,
  handleGetSidebarUsers,
  handleSendMessage,
} from "../controllers/message.controller.js";
import { multerGrabber } from "../middlewares/multer.js";
const router = express();

/* =====================================================
   📇 MESSAGE & CHAT ROUTES (PROTECTED)
===================================================== */

// 👥 Get sidebar users (all users except current user)
// - protectRoute → ensures user is authenticated
// - handleGetSidebarUsers → fetches sidebar contacts
router.get("/users", protectRoute, handleGetSidebarUsers);

// 💬 Get chats with a specific user
// - :id → receiver user's id
// - protectRoute → ensures only logged-in users can fetch messages
router.get("/chats/:id", protectRoute, handleGetMessages);

/* =====================================================
   ✉️ SEND MESSAGE (TEXT / IMAGE)
===================================================== */

// Send a message to a specific user
// 1️⃣ protectRoute → verifies JWT & attaches req.user
// 2️⃣ multerGrabber → extracts optional image (msgImage)
// 3️⃣ handleSendMessage → saves message & emits socket event
router.post(
  "/send/:id",
  protectRoute,
  multerGrabber.single("msgImage"),
  handleSendMessage
);

export default router;
