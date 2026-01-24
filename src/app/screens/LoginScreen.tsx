import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, auth } = useApp();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = () => {
    setError(null);
    if (loginMethod === 'phone') {
      const digits = phoneNumber.replace(/\D/g, '');
      if (digits.length < 10) {
        setError('Enter a valid 10-digit phone number.');
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Enter a valid email address.');
        return;
      }
    }
    setShowOTP(true);
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }

    // For demo/prototype: we accept any 6 digit code. 
    // In production, this should verify against backend.
    // The previous logic called login() which did a password sign-in.

    try {
      await login(loginMethod === 'email' ? email : undefined, loginMethod === 'phone' ? phoneNumber : undefined);
      navigate(auth.hasCompletedOnboarding ? '/dashboard' : '/action-selection');
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl mb-6 relative shadow-lg shadow-green-900/10">
            <Sprout className="w-14 h-14 text-green-600" />
            <div className="absolute inset-0 bg-green-200 rounded-3xl animate-ping opacity-20"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
            AgriSmart
          </h1>
          <p className="text-gray-600 font-medium text-base">
            Your Digital Farming Companion
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-3xl shadow-xl shadow-gray-900/10 border border-gray-100/50">
          {!showOTP ? (
            <>
              {/* Login Method Toggle */}
              <div className="flex gap-2 p-1 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl mb-8 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${loginMethod === 'phone'
                    ? 'bg-white text-green-700 shadow-md shadow-green-900/10'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Phone Number
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${loginMethod === 'email'
                    ? 'bg-white text-green-700 shadow-md shadow-green-900/10'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Email Address
                </button>
              </div>

              {/* Input Field */}
              <div className="mb-8">
                {loginMethod === 'phone' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="farmer@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-600 mb-4 font-medium bg-red-50 px-3 py-2 rounded-xl border border-red-100">{error}</p>}
              {/* Send OTP Button */}
              <button
                onClick={handleSendOTP}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-600/25"
              >
                Get OTP
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-sm text-gray-400 font-medium">Or</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  console.log("Google Login Clicked");
                  await loginWithGoogle();
                }}
                className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                Continue with Google
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-500 text-sm">
                  Sent to {loginMethod === 'phone' ? phoneNumber : email}
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-8">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4 5 6"
                  maxLength={6}
                  className="w-full px-4 py-5 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-center text-3xl font-bold tracking-[0.5em] text-gray-900 placeholder:text-gray-300"
                />
              </div>

              <div className="mb-8 text-center">
                <button
                  onClick={() => setError(null)}
                  className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors hover:underline"
                >
                  Resend Code
                </button>
              </div>

              {error && <p className="text-sm text-red-600 mb-4 font-medium bg-red-50 px-3 py-2 rounded-xl border border-red-100">{error}</p>}
              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-600/30 active:scale-[0.98] transition-all shadow-lg shadow-green-600/25"
              >
                Verify & Login
              </button>

              <button
                onClick={() => setShowOTP(false)}
                className="w-full mt-4 text-gray-500 py-3 font-medium hover:text-gray-700 transition"
              >
                Change {loginMethod === 'phone' ? 'Phone' : 'Email'}
              </button>
            </>
          )}

          {/* New User Link */}
          {!showOTP && (
            <div className="mt-8 text-center">
              <p className="text-gray-500">
                New to AgriSmart?{' '}
                <button
                  onClick={() => navigate('/action-selection')}
                  className="text-green-600 font-semibold hover:text-green-700 ml-1"
                >
                  Register Farm
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
