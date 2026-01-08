import React, { useEffect, useRef, useState } from "react";
import { ServerApi } from "../api/AuthApi";
import ContactListCard from "../components/ui/ContactListCard";
import SkeletonContactCard from "../components/skeleton/ContactListSkeleton";
import { MessageCircle } from "lucide-react";
import ContactSideBar from "../components/ui/ContactSideBar";
import SendMessage from "../components/message/SendMessage";
import ReceiveMessage from "../components/message/ReceiveMessage";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import MessageInput from "../components/message/MessageInput";
const ChatPage = () => {
  // 🔐 Logged-in user info
  const { userAuth } = useAuthStore();

  // 💬 Chat-related state & actions
  const {
    getContacts, // 📇 Fetch contact list
    getUserChats, // 💬 Fetch chats (used indirectly)
    contacts, // 👥 All contacts
    chats, // 📨 Messages with selected contact
    selectedContact, // 👉 Currently opened chat
    startLookingForNewMessages, // 📡 Listen for incoming messages
  } = useChatStore();

  // ⬇️ Ref used to auto-scroll to latest message
  const messagesEndRef = useRef(null);

  // 🔽 Auto-scroll whenever chats update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, getUserChats]);

  // 🚀 Initial load: fetch contacts & start socket listeners
  useEffect(() => {
    getContacts();
    startLookingForNewMessages();
  }, []);

  return (
    <section className="w-full h-screen flex justify-center items-center p-2 sm:p-4">
      {/* 🧱 Main Chat Container */}
      <div className="w-full sm:w-[95%] lg:w-[85%] xl:w-[80%] h-full sm:h-[95%] lg:h-[90%] flex flex-row rounded-none sm:rounded-2xl border-0 sm:border border-zinc-700 overflow-hidden">
        {/* 📇 LEFT: Contacts Sidebar */}
        <ContactSideBar contacts={contacts} />

        {selectedContact ? (
          // 💬 RIGHT: Active Chat View
          <div className="relative w-full h-full flex flex-col">
            {/* 🧑‍🤝‍🧑 Chat Header */}
            <div className="z-10 absolute h-[60px] sm:h-[70px] w-full px-3 sm:px-6 flex items-center justify-between bg-zinc-900/70 backdrop-blur-lg border-b border-zinc-200/12">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* 👤 Profile Picture */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-zinc-600 to-zinc-700 shrink-0 overflow-hidden flex">
                  <img
                    className="w-full object-cover"
                    src={selectedContact.profilePic}
                    alt=""
                  />
                </div>

                {/* 📝 Contact Name */}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">
                    {selectedContact.fullName}
                  </h4>
                </div>
              </div>
            </div>

            {/* 📨 Messages Area */}
            <div
              className="flex-1 pt-[62px] sm:pt-[72px] px-2 overflow-y-auto
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {chats.map((chat, idx) => {
                // 👉 Decide message direction (sent vs received)
                if (userAuth._id == chat.senderId) {
                  return <SendMessage key={idx} chat={chat} />;
                } else {
                  return <ReceiveMessage key={idx} chat={chat} />;
                }
              })}

              {/* 🧲 Invisible anchor to keep scroll at bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* ⌨️ Message Input */}
            <MessageInput />
          </div>
        ) : (
          // 📭 RIGHT: Empty State (No chat selected)
          <div className="w-full h-full bg-zinc-900/80 flex items-center justify-center">
            <div className="flex flex-col items-center text-center max-w-sm px-6">
              {/* 💭 Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4 sm:mb-6">
                <MessageCircle
                  size={28}
                  className="text-zinc-400 sm:w-9 sm:h-9"
                />
              </div>

              {/* 📝 Text */}
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
                No conversation selected
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Choose a contact from the list to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatPage;
