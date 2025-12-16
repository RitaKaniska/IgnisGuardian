import React, { useState } from 'react';
import { Flame, Mail, Lock, Eye, EyeOff, Shield, Smartphone } from 'lucide-react';

function FireAlarmLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl  rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10 text-white">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl shadow-orange-500/50 mb-8 animate-pulse">
              <Flame className="w-12 h-12 text-white" />
            </div>
        </div>

        {/* Title */}
        <h1 className="flex justify-center text-3xl font-bold mb-1">Đăng nhập</h1>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm mb-2">Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Mật khẩu</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-orange-500" />
            Ghi nhớ đăng nhập
          </label>
          <a href="#" className="text-orange-400 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        {/* Login button */}
        <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition shadow-lg">
          Đăng nhập
        </button>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/20" />
          <span className="px-3 text-xs text-white/60">
            Hoặc đăng nhập với
          </span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social buttons */}
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

        {/* Register */}
        <p className="text-center text-sm text-white/70">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-orange-400 font-semibold hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  )
}

export default FireAlarmLogin