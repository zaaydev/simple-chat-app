import { create } from "zustand";
import { ServerApi } from "../api/AuthApi";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  /* =======================
     🌍 GLOBAL STATES
  ======================== */

  contacts: [], // 👥 All sidebar contacts
  setContacts: (data) => set({ contacts: data }),

  selectedContact: null, // 👉 Currently opened contact
  setSelectedContact: (data) => set({ selectedContact: data }),

  chats: [], // 📨 Messages with selected contact
  setChats: (data) => set({ chats: data }),

  /* =======================
     📡 FETCHING DATA
  ======================== */

  // 📇 Fetch sidebar contacts
  getContacts: async () => {
    try {
      const res = await ServerApi.get("/api/message/users");

      // ✅ Save sidebar users
      set({ contacts: res.data.sidebarUsers });
    } catch (error) {
      // 🚨 API error
      console.log(error.response.message, error);
    }
  },

  // 💬 Fetch chats of selected user
  getUserChats: async (hisId) => {
    const { contacts } = get();

    // 🔍 Find clicked contact from sidebar
    const selectedContactData = contacts.find((contact, idx) => {
      if (contact._id == hisId) return contact;
    });

    // 👉 Set active chat user
    set({ selectedContact: selectedContactData });

    try {
      // 📤 Fetch messages with this user
      const res = await ServerApi.get(`/api/message/chats/${hisId}`);

      // ✅ Store chat messages
      set({ chats: res.data.messages });
    } catch (error) {
      // 🚨 API error
      console.log(error.response, error);
    }
  },

  /* =======================
     ✉️ LOCAL CHAT UPDATE
  ======================== */

  // 🧩 Add sent message instantly (optimistic update)
  handleUpdateChatsForSender: (newMsg) => {
    set((state) => ({
      chats: [...state.chats, newMsg],
    }));
  },

  /* =======================
     🔌 SOCKET LISTENERS
  ======================== */

  startLookingForNewMessages: () => {
    // 🔌 Get socket instance from auth store
    const socket = useAuthStore.getState().socket;

    // 📡 Listen for new incoming messages
    socket.on("newMsg", (newMsg) => {
      // 🧠 Functional set ensures no message is lost
      // even if many messages arrive very fast
      set((state) => ({
        chats: [...state.chats, newMsg],
      }));
    });
  },
}));

export default useChatStore;
