import React, { useRef, useState } from "react";
import { Image } from "lucide-react";
import { ServerApi } from "../../api/AuthApi";
import useChatStore from "../../store/useChatStore";

const MessageInput = () => {
  const [messageInput, setMessageInput] = useState("");
  const [imageContainer, setImageContainer] = useState("");
  const { selectedContact, handleUpdateChatsForSender } = useChatStore();
  const imageUploadInput = useRef(null);

  const handleAddImage = (e) => {
    setImageContainer(e.target.files[0]);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !imageContainer) return;

    let formData;
    formData = new FormData();

    // multer will handle this file
    if (imageContainer) formData.append("msgImage", imageContainer);

    // text automatically goes in req.body.msgText
    formData.append("msgText", messageInput.trim());

    try {
      const res = await ServerApi.post(
        `/api/message/send/${selectedContact._id}`,
        formData
      );
      setMessageInput("");
      setImageContainer(null);
      const newMsg = res.data.newMessage;

      handleUpdateChatsForSender(newMsg);
    } catch (error) {
      console.log(error.response, error);
      alert("Message failed to send. Try again.");
    }
  };

  // 🔹 PREVIEW (derived, no new logic/state)
  const imagePreview = imageContainer
    ? URL.createObjectURL(imageContainer)
    : null;

  function handlePressedEnter(e) {
    if (e.key != "Enter") return;
    if (messageInput.trim() == "") return alert("enter something");
    handleSendMessage();
  }

  return (
    <div className="p-4 border-t border-zinc-800">
      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={() => setImageContainer(null)}
              type="button"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full
                         bg-zinc-800 text-white text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 bg-zinc-800/70 rounded-xl px-4 py-2">
        <input
          onKeyDown={(e) => handlePressedEnter(e)}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
        />

        <input
          ref={imageUploadInput}
          accept="image/*"
          onChange={handleAddImage}
          type="file"
          hidden
        />

        {/* Image Icon UI */}
        <button
          onClick={() => imageUploadInput.current.click()}
          type="button"
          className="text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
        >
          <Image size={20} />
        </button>

        <button
          onClick={handleSendMessage}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium hover:bg-indigo-500 transition cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
