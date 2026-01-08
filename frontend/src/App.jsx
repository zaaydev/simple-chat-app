import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import useAuthStore from "./store/useAuthStore";
import { LoaderCircle } from "lucide-react";
import useChatStore from "./store/useChatStore";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  // 🔐 Auth-related global state & actions
  const {
    userAuth, // 👤 Logged-in user info (truthy = authenticated)
    setUserAuth, // 🧩 Setter for auth state (not used here yet)
    checkAuthOnRefresh, // 🔄 Validates session on page refresh
    isCheckingAuth, // ⏳ Tells whether auth check is in progress
    onlineUsers, // 🟢 Online users list (future real-time usage)
  } = useAuthStore();

  // 💬 Chat-related actions
  const { handleUpdateChats } = useChatStore(); // 🔁 Sync chats when needed

  // 🚀 Runs once when app mounts
  useEffect(() => {
    // 🔍 Checks if user is already logged in (cookies / JWT / session)
    checkAuthOnRefresh();
  }, []);

  // ⏳ While authentication status is being verified
  if (isCheckingAuth)
    return (
      <main className="h-screen bg-zinc-900 text-white flex justify-center items-center">
        {/* 🔄 Loader shown to avoid UI flicker */}
        <LoaderCircle size={60} className="animate-spin" />
      </main>
    );

  // 🧱 Main application UI (after auth check is done)
  return (
    <main className="h-screen bg-zinc-900 text-white">
      <ToastContainer />

      {/* 🛣️ Application routes */}
      <Routes>
        {/* ✅ Routes controlled by authentication */}

        {/* 🏠 Root route
           - Logged in → ChatPage
           - Not logged in → SignupPage */}
        <Route path="/" element={userAuth ? <ChatPage /> : <SignupPage />} />

        {/* 👤 Profile route (protected) */}
        <Route
          path="/profile"
          element={userAuth ? <ProfilePage /> : <SignupPage />}
        />

        {/* 🔐 Auth-only routes */}

        {/* ✍️ Signup route
           - Guest → SignupPage
           - Logged in → ChatPage */}
        <Route
          path="/signup"
          element={!userAuth ? <SignupPage /> : <ChatPage />}
        />

        {/* 🔑 Login route
           - Guest → LoginPage
           - Logged in → ChatPage */}
        <Route
          path="/login"
          element={!userAuth ? <LoginPage /> : <ChatPage />}
        />
      </Routes>
    </main>
  );
};

export default App;
