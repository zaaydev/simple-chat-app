import React from "react";
import ContactListCard from "./ContactListCard";
import SkeletonContactCard from "../skeleton/ContactListSkeleton";
import useAuthStore from "../../store/useAuthStore";
import { useRef } from "react";
import { useState } from "react";
import { ServerApi } from "../../api/AuthApi";
import { useEffect } from "react";
const ContactSideBar = ({ contacts }) => {
  // 📂 Ref to trigger hidden file input programmatically
  const fileInputRef = useRef(null);

  // 🔐 Auth & user-related state
  const { userAuth, setUserAuth, handleUploadAvatar, preview, onlineUsers } =
    useAuthStore();

  return (
    <aside className="w-[35%] h-full bg-zinc-900/90 border-r border-zinc-800 flex flex-col">
      
      {/* 🧑 Header: User info & avatar */}
      <div className="p-4 border-b border-zinc-800/80">
        
        {/* 🖼️ Profile picture (click to upload new avatar) */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="w-10 h-10 flex bg-white/10 rounded-full cursor-pointer overflow-hidden"
        >
          <img
            className="w-full object-cover object-center"
            src={preview || userAuth?.profilePic}
            alt=""
          />
        </div>

        {/* 📁 Hidden file input (triggered via avatar click) */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => handleUploadAvatar(e)}
          className="hidden"
        />

        {/* 👤 User name */}
        <a
          href="/profile"
          className="text-xl font-semibold text-zinc-100 -mb-1 hover:underline"
        >
          {userAuth.fullName}
        </a>

        {/* 🔗 Profile link */}
        <a
          href="/profile"
          className="px-2 py-0.5 bg-zinc-700 text-white rounded-md ml-2 text-xs"
        >
          view profile
        </a>

        {/* 🕘 Section label */}
        <p className="text-xs text-zinc-400 mt-1">
          Recent conversations
        </p>
      </div>

      {/* 📇 Contact List */}
      <div
        className="flex-1 overflow-y-auto
               [scrollbar-width:none]
               [-ms-overflow-style:none]
               [&::-webkit-scrollbar]:hidden"
      >
        {/* ⏳ Loading state: skeleton cards */}
        {contacts.length == 0 &&
          Array.from({ length: 8 }).map((_, idx) => {
            return <SkeletonContactCard key={idx} />;
          })}

        {/* 👥 Render contact list */}
        {contacts.length > 0 &&
          contacts.map((contact, idx) => {
            return (
              <ContactListCard
                contact={contact}
                key={contact._id}
              />
            );
          })}
      </div>
    </aside>
  );
};

export default ContactSideBar;
