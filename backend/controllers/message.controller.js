import { MessageModel } from "../models/message.model.js";
import { UserModel } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { Readable } from "stream";
import { ioServer, getSocketIdWithUserId } from "../src/socket.js";

/* =====================================================
   📇 GET SIDEBAR USERS
===================================================== */
export const handleGetSidebarUsers = async (req, res) => {
  // 👤 Get current logged-in user id
  const currentUserId = req.user._id;

  try {
    // 🔍 Find every user from database except current user (ne = not equal)
    const sidebarUsers = await UserModel.find({
      _id: { $ne: currentUserId },
    }).select("-password"); // 🔐 Exclude password for security

    // ✅ Send sidebar users to frontend
    res.status(200).json({ sidebarUsers });
  } catch (error) {
    console.log(error.message);
    // 🚨 Server-side error
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   💬 GET MESSAGES BETWEEN TWO USERS
===================================================== */
export const handleGetMessages = async (req, res) => {
  // 👤 Get your id
  const currentUserId = req.user._id;

  // 🧑 Get his/her id from params
  const { id } = req.params;
  const hisId = id;

  try {
    // 🔁 Fetch messages where:
    // - you sent messages to him
    // - OR he sent messages to you
    const messages = await MessageModel.find({
      $or: [
        {
          senderId: currentUserId,
          receiverId: hisId,
        },
        {
          senderId: hisId,
          receiverId: currentUserId,
        },
      ],
    });

    // ✅ Send messages to frontend
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error.message);
    // 🚨 Server-side error
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   ✉️ SEND MESSAGE (TEXT / IMAGE / REAL-TIME)
===================================================== */
export const handleSendMessage = async (req, res) => {
  const currentUserId = req.user._id;   // 👤 Sender id
  const { id: hisId } = req.params;     // 🧑 Receiver id

  const msgImage = req.file;            // 🖼️ Optional image
  const msgText = req.body.msgText;     // 💬 Optional text

  // 1️⃣ msgText is directly usable
  // but msgImage must be formatted properly before sending to cloud storage
  // make the buffer usable/sharable in msgImage
  let usableImageChuncks;

  if (msgImage) {
    // 🔄 Convert image buffer into readable stream
    usableImageChuncks = Readable.from(msgImage.buffer);
    // 🚰 Now we can send it smoothly using pipe()
  }

  try {
    let cloudinaryResponse = "";

    // ☁️ If an image stream exists, upload it to Cloudinary
    if (usableImageChuncks) {
      // 🔁 Wrap stream-based upload inside a Promise
      // so we can use async/await instead of callbacks
      cloudinaryResponse = await new Promise((resolve, reject) => {
        // 🚰 Pipe the readable image stream into Cloudinary upload stream
        usableImageChuncks.pipe(
          cloudinary.uploader.upload_stream({}, (err, cloudinaryRes) => {
            // ❌ If Cloudinary throws an error, reject the Promise
            if (err) reject(err);

            // ✅ If upload succeeds, resolve with Cloudinary response
            resolve(cloudinaryRes);
          })
        );
      });
    }

    // 🗄️ Create new message document in database
    const newMessage = await MessageModel.create({
      senderId: currentUserId,
      receiverId: hisId,
      text: msgText,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
    });

    // 💾 Ensure message is saved
    await newMessage.save();

    // 🔌 Get socketId of receiver to emit message only to him
    const hisSocketId = getSocketIdWithUserId(hisId);

    // 📡 Instantly notify frontend using socket.io
    if (hisSocketId) {
      ioServer.to(hisSocketId).emit("newMsg", newMessage);
    }
    // 🟢 If socketId exists → user is online → real-time message sent

    // ✅ Respond back to sender
    res.status(200).json({ newMessage });
  } catch (error) {
    console.log(error.message);
    // 🚨 Server-side error
    res.status(500).json({ message: "Internal server error" });
  }
};
