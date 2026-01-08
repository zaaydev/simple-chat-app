import React, { useEffect, useState } from "react";
import { LogOut, User, Mail, Calendar, Clock } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
    <div className="bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md border border-zinc-700">
      <div className="flex flex-col items-center space-y-6">
        {/* Profile picture skeleton */}
        <div className="w-32 h-32 rounded-full bg-zinc-700 animate-pulse" />

        {/* Name skeleton */}
        <div className="w-48 h-8 bg-zinc-700 rounded-lg animate-pulse" />

        {/* Email skeleton */}
        <div className="w-64 h-6 bg-zinc-700 rounded-lg animate-pulse" />

        {/* Button skeleton */}
        <div className="w-full h-12 bg-zinc-700 rounded-lg animate-pulse mt-4" />

        {/* Footer skeleton */}
        <div className="w-full h-4 bg-zinc-700 rounded animate-pulse mt-6" />
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { userAuth, handleLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Simulate loading state - adjust based on your actual auth loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogoutFunc = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  if (isLoading || !userAuth) {
    return <ProfileSkeleton />;
  }

  const user = userAuth;

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      {/* Main Container */}
      
      <div className="bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md border border-zinc-700">
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div className="relative">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.fullName || "Profile"}
                className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center border-4 border-zinc-600 shadow-lg">
                <User className="w-16 h-16 text-zinc-400" />
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-800 shadow-lg" />
          </div>

          {/* Username / Full Name */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              {user.fullName || "User"}
            </h1>
            {user.username && user.username !== user.fullName && (
              <p className="text-zinc-400 text-sm">@{user.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-700/50 px-4 py-2 rounded-lg">
            <Mail className="w-4 h-4" />
            <span className="text-sm md:text-base">{user.email}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogoutFunc}
            disabled={isLoggingOut}
            className="w-full mt-4 bg-red-500/80 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>

          {/* Account Info */}
          <div className="w-full pt-6 mt-6 border-t border-zinc-700 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs md:text-sm">
              <Calendar className="w-4 h-4" />
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs md:text-sm">
              <Clock className="w-4 h-4" />
              <span>Last seen {formatDate(user.updatedAt) || "recently"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
