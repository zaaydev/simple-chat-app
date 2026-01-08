import React from "react";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import { useEffect } from "react";
const ContactListCard = ({ contact }) => {
  // 🟢 List of currently online user IDs
  const { onlineUsers } = useAuthStore();

  // 💬 Fetch chats for selected contact
  const { getUserChats } = useChatStore();

  // 🟢 Check if this contact is online
  const isOnline = onlineUsers.includes(contact._id);

  return (
    <div
      // 👉 Load chat history when user clicks a contact
      onClick={() => getUserChats(contact._id)}
      className="group flex items-center gap-4 px-4 py-3
                     cursor-pointer transition
                     hover:bg-zinc-800/70
                     border-b border-zinc-800/60"
    >
      {/* 🖼️ Avatar */}
      <div className="w-12 h-12 rounded-full bg-linear-to-br from-zinc-600 to-zinc-700 shrink-0 overflow-hidden flex">
        <img
          className="w-full object-cover object-center"
          src={contact.profilePic}
          alt=""
        />
      </div>

      {/* 🧾 Contact info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-100 truncate">
          {contact.fullName}
        </h4>

        {/* 🟢 Online / ⚪ Offline text */}
        <p className="text-xs text-zinc-400">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>

      {/* 🔘 Online status indicator */}
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline
            ? "bg-green-500"
            : "bg-zinc-500 group-hover:bg-zinc-400"
        } transition`}
      />
    </div>
  );
};

export default ContactListCard;
