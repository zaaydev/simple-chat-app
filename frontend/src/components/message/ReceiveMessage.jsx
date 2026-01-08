import React from "react";
import dayjs from "dayjs";
const ReceiveMessage = ({ chat }) => {
  // ⏰ Format message timestamp (12-hour format)
  const time = dayjs(chat.createdAt).format("hh:mm A");

  return (
    <div className="flex flex-col justify-start items-start my-2 max-w-[60%] mr-auto">
      {/* 🖼️ Image message (if received image exists) */}
      {chat.image && (
        <div className="overflow-hidden pb-1">
          <img className="w-40 rounded-2xl" src={chat.image} alt="" />
        </div>
      )}

      {/* 💬 Text message (if received text exists) */}
      {chat.text && (
        <p className="px-4 py-2 rounded-lg bg-zinc-700">{chat.text}</p>
      )}

      {/* ⏱️ Message timestamp */}
      <p className="text-[11px] text-start pl-2 text-white/40">{time}</p>
    </div>
  );
};

export default ReceiveMessage;
