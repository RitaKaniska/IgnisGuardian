import React from "react";
import { Flame, Mail, Lock, User } from "lucide-react";

function FireAlarmRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10 text-white">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl shadow-orange-500/50 mb-8">
            <Flame className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="flex justify-center text-3xl font-bold mb-1">
          Đăng ký
        </h1>
        <p className="text-center text-white/60 mb-8">
          Tạo tài khoản mới để bắt đầu sử dụng
        </p>

        {/* Full name */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Họ và tên</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full pl-12 rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full pl-12 rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Register button */}
        <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition shadow-lg mb-6">
          Đăng ký
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="px-3 text-xs text-white/60">
            Hoặc đăng ký với
          </span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium">Google</span>
          </button>

          <button className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            <span className="font-medium">Facebook</span>
          </button>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-white/70">
          Đã có tài khoản?{" "}
          <a href="#" className="text-orange-400 font-semibold hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}

export default FireAlarmRegister;
