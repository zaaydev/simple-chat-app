import mongoose from "mongoose";

// 📨 Message schema (one document = one message)
const messageSchema = new mongoose.Schema(
  {
    // 👤 User who sent the message
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB reference ID
      ref: "User",                          // Refers to User collection
      required: true,
    },

    // 🧑 User who receives the message
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB reference ID
      ref: "User",                          // Refers to User collection
      required: true,
    },

    // 💬 Text content of the message (optional)
    text: String,

    // 🖼️ Image URL (Cloudinary or other storage)
    image: String,
  },
  {
    // ⏱️ Automatically adds:
    // createdAt → when message was sent
    // updatedAt → when message was edited (if ever)
    timestamps: true,
  }
);

// 📦 Export Message model
export const MessageModel = mongoose.model("Message", messageSchema);
