import axios from "axios";
import dayjs from "dayjs";
import { Trash } from "lucide-react";
import { useState } from "react";
const SendMessage = ({ chat }) => {
  // ⏰ Format message timestamp (12-hour format)
  const time = dayjs(chat.createdAt).format("hh:mm A");

  // 🚧 FUTURE WORK: message options (delete, etc.)
  // const [showOptions, setShowOptions] = useState(false);

  // todo : make delete functionality
  // function ShowMessageOptions(e) {
  //   e.preventDefault();
  //   setShowOptions((val) => !val);
  // }

  // function ConfirmMessageDelete() {
  //   try {
  //     // 🗑️ Delete message logic will live here
  //   } catch (error) {
  //     // 🚨 Handle delete error
  //   }
  // }

  return (
    <div
      // 🖱️ Right-click handler (reserved for future message options)
      onContextMenu={(e) => ShowMessageOptions(e)}
      className="flex flex-col justify-end items-end my-2 max-w-[60%] ml-auto relative"
    >
      {/* 🧰 Message options popup (currently disabled / WIP) */}
      {/* {showOptions && (
        <div className="absolute w-30 h-8 bottom-0 bg-black/10 backdrop-blur-xs border border-white/10 text-white rounded-lg py-1 px-2 flex justify-center items-center">
          <button
            onClick={ConfirmMessageDelete}
            className="cursor-pointer flex justify-center items-center gap-2 text-red-500"
          >
            <Trash size={17} />
            <span>Delete</span>
          </button>
        </div>
      )} */}

      {/* 🖼️ Image message (if present) */}
      {chat.image && (
        <div className="overflow-hidden pb-1">
          <img
            className="w-40 rounded-2xl"
            src={chat.image}
            alt=""
          />
        </div>
      )}

      {/* 💬 Text message (if present) */}
      {chat.text && (
        <p className="inline-block px-4 py-2 rounded-lg bg-blue-900">
          {chat.text}
        </p>
      )}

      {/* ⏱️ Message timestamp */}
      <p className="text-[11px] text-end pr-2 text-white/40">
        {time}
      </p>
    </div>
  );
};

export default SendMessage;
