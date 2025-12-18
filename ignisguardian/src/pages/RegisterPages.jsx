import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// *** FIREBASE IMPORT ***
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Đảm bảo đường dẫn đến file firebase của bạn là chính xác
// ***********************
import { Flame, Eye, EyeOff } from 'lucide-react';

function FireAlarmLogin() { // KHÔNG CẦN onLogin props nữa
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Bắt đầu loading

    // 1. Validate inputs
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Gọi Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Đăng nhập Firebase thành công!');
      // 3. Navigate on success
      navigate('/dashboard'); 

    } catch (err) {
      // 4. Handle Firebase errors
      console.error(err);
      
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Email hoặc mật khẩu không chính xác.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Địa chỉ Email không hợp lệ.';
      }
      
      setError(errorMessage);
      
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Container chính, đã điều chỉnh max-w để trông cân đối hơn cho form login */}
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 sm:p-10 text-white">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl shadow-orange-500/50 mb-4 
                          ring-4 ring-orange-500/20 animate-pulse">
              <Flame className="w-12 h-12 text-white" />
            </div>
        </div>

        {/* Title */}
        <h1 className="flex justify-center text-3xl font-bold mb-1">
            Đăng nhập
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email-input" className="block text-sm mb-2 font-medium text-white/80">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
              disabled={isLoading} // Tắt input khi đang loading
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password-input" className="block text-sm mb-2 font-medium text-white/80">Mật khẩu</label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                disabled={isLoading} // Tắt input khi đang loading
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition duration-200"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                disabled={isLoading} // Tắt button khi đang loading
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm mb-8">
            <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white transition duration-200">
              <input type="checkbox" className="accent-orange-500 w-4 h-4" disabled={isLoading} />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="text-orange-400 hover:text-orange-300 hover:underline transition duration-200">
              Quên mật khẩu?
            </a>
          </div>

          {/* Login button */}
          <button 
            type="submit"
            disabled={isLoading} // Vô hiệu hóa khi đang loading
            className={`w-full py-3 rounded-xl font-bold text-lg transition duration-300 shadow-xl shadow-red-500/30 mb-6 ${
                isLoading 
                ? 'bg-gray-500/50 cursor-not-allowed' // Màu xám và không cho click khi loading
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-white/70">
          Chưa có tài khoản?{" "}
          <button 
            type="button"
            onClick={handleRegisterClick}
            disabled={isLoading}
            className="text-orange-400 font-semibold hover:text-orange-300 hover:underline transition duration-200 disabled:opacity-50"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  )
}

export default FireAlarmLogin;
