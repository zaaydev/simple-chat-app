import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleUserLoginRequest } = useAuthStore();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    await handleUserLoginRequest(data);
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmitLogin}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl"
      >
        {/* Heading */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-zinc-400">Login to your account</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500
            outline-none border border-zinc-700 focus:border-zinc-500 transition"
          />

          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500
            outline-none border border-zinc-700 focus:border-zinc-500 transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-white text-zinc-900 font-medium
          hover:bg-zinc-200 transition active:scale-[0.98]"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <span className="text-white hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
