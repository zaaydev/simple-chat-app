import { create } from "zustand";
import { ServerApi } from "../api/AuthApi";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

// TOAST MESSAGES THEME
const toastConfig = {
  theme: "dark",
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    background: "#18181b", // zinc-900
    color: "#fafafa",
    border: "1px solid #27272a", // zinc-800
  },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useAuthStore = create((set, get) => ({
  /* =======================
     🌍 GLOBAL STATES
  ======================== */

  userAuth: null, // 👤 Holds logged-in user data
  setUserAuth: (data) => set({ userAuth: data }),

  isCheckingAuth: true, // ⏳ Used to block UI until auth is verified
  setIsCheckingAuth: (data) => set({ isCheckingAuth: data }),

  socket: null, // 🔌 Socket instance
  onlineUsers: [], // 🟢 IDs of users currently online

  /* =======================
     🔄 AUTH CHECK (REFRESH)
  ======================== */

  checkAuthOnRefresh: async () => {
    set({ isCheckingAuth: true }); // 🚦 Lock UI while checking auth

    try {
      // 🔍 Ask backend if session/cookie is still valid
      const res = await ServerApi.get("/api/auth/check");

      // ✅ User is authenticated
      set({ userAuth: res.data.user });

      // 🔌 Connect socket after successful auth
      get().connectToSocket();
    } catch (error) {
      // ❌ Not authenticated
      set({ userAuth: null });
    } finally {
      // 🔓 Allow UI rendering again
      set({ isCheckingAuth: false });
    }
  },

  /* =======================
     ✍️ SIGN UP
  ======================== */

  handleUserSignupRequest: async (data) => {
    try {
      // 📤 Send signup data to server
      const res = await ServerApi.post("/api/auth/signup", data);

      // ✅ Save logged-in user
      set({ userAuth: res.data });

      // 🔌 Connect socket after signup
      get().connectToSocket();
      // ✅ Signup success
      toast.success("Account created successfully 🚀", toastConfig);
    } catch (error) {
      // 🧯 Log backend error message
      // ❌ Signup failed
      toast.error(
        error.response?.data?.message || "Signup failed 😵",
        toastConfig
      );
    }
  },

  /* =======================
     🔑 LOG IN
  ======================== */

  handleUserLoginRequest: async (data) => {
    try {
      // 📤 Send login credentials
      const res = await ServerApi.post("/api/auth/login", data);

      // ✅ Store authenticated user
      set({ userAuth: res.data });

      // 🔌 Connect socket after login
      get().connectToSocket();
      // ✅ Login success
      toast.success("Welcome back 👋", toastConfig);
    } catch (error) {
      // ❌ Login failed
      toast.error(
        error.response?.data?.message || "Invalid credentials ❌",
        toastConfig
      );
    }
  },

  /* =======================
     🚪 LOG OUT
  ======================== */

  handleLogout: async () => {
    try {
      // 📤 Inform server to clear session
      await ServerApi.get("/api/auth/logout");
      // this request will simply remove browser cookie. simple logic!

      // 🔌 Disconnect socket safely
      get().disconnectToSocket();
      // ✅ Logout success
      toast.success("Logged out successfully 👋", toastConfig);
    } finally {
      // 🧹 Clear local auth state no matter what
      set({ userAuth: null });
    }
  },

  /* =======================
     🔌 SOCKET CONNECTION
  ======================== */

  connectToSocket: () => {
    const { userAuth } = get();

    // 🛑 Prevent socket connection if:
    // - user not logged in
    // - socket already connected
    if (!userAuth || get().socket?.connected) return;

    // 🧠 Create socket with user ID as query
    const socket = io(BACKEND_URL, {
      query: {
        clientId: userAuth?._id,
      },
    });

    socket.connect(); // 🚀 Open socket connection
    set({ socket: socket });

    // 📡 Listen for online users list from server
    // backend will send signals if any user is online (or connected to socket)
    socket.on("getOnlineUsersFromServer", (onlineUserIds) => {
      set({ onlineUsers: onlineUserIds });
    });
  },

  disconnectToSocket: () => {
    // 🛑 Avoid calling disconnect on dead socket
    if (!get().socket.connected) return;

    // 🔌 Close socket connection
    get().socket.disconnect();
  },

  /* =======================
     🖼️ IMAGE STATES
  ======================== */

  preview: null, // 👀 Local preview URL for avatar
  setPreview: (data) => set({ preview: data }),

  /* =======================
     📤 IMAGE UPLOAD
  ======================== */

  handleUploadAvatar: async (e) => {
    // 1️⃣ Get File from input element 📂
    const file = e.target.files[0];
    if (!file) return;

    // 2️⃣ Preview image instantly 👀 (better UX, user sees image immediately)
    const previewImageUrl = URL.createObjectURL(file);
    set({ preview: previewImageUrl });

    // 📦 FormData is used to package files + fields
    // so the browser can send them properly to the server
    const formData = new FormData();

    // 🏷️ Tell the browser:
    // "Pack this file inside FormData with the key 'profilePic'"
    formData.append("profilePic", file);

    // 📬 The browser automatically sends this as multipart/form-data
    // ➜ multiple parts inside a single request body

    // 4️⃣ Send that FormData box to the backend 🚀
    try {
      // 🔄 Sending request to update-profile endpoint
      // which updates the user's profile image
      const res = await ServerApi.put("/api/auth/update-profile", formData);

      // 🧠 multipart/form-data explained:
      // - The request body contains multiple parts
      // - Each part has its own headers + data
      // - One part is the image labeled "profilePic"
      // - The backend reads this file separately

      // ✅ If backend responds successfully,
      // update userAuth with the latest user data
      if (res) set({ userAuth: res.data });

      // ✅ Avatar updated
      toast.success("Profile picture updated 🖼️", toastConfig);
    } catch (error) {
      // 🚨 Log error if upload fails
      toast.error(
        error.response?.data?.message || "Image upload failed 😬",
        toastConfig
      );
    }
  },
}));

export default useAuthStore;
