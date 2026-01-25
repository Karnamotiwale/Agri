import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, auth } = useApp();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  // Auto-redirect if logged in
  useEffect(() => {
    if (!loading && user) {
      console.log("LoginScreen: User is logged in, redirecting to dashboard...");
      navigate(auth.hasCompletedOnboarding ? '/dashboard' : '/action-selection');
    }
  }, [user, loading, auth.hasCompletedOnboarding, navigate]);

  // Login Method State
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  // Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    setError(null);
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (loginMethod === 'phone') {
      const digits = phoneNumber.replace(/\D/g, '');
      if (digits.length < 10) {
        setError('Please enter a valid 10-digit phone number.');
        setIsLoading(false);
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
    }

    setShowOTP(true);
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code sent to your device.');
      return;
    }

    setIsLoading(true);

    try {
      // For demo/prototype: we accept any 6 digit code.
      await login(loginMethod === 'email' ? email : undefined, loginMethod === 'phone' ? phoneNumber : undefined);
      navigate(auth.hasCompletedOnboarding ? '/dashboard' : '/action-selection');
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await loginWithGoogle();
      // Note: Redirect will happen, so loading state persists until unload
    } catch (err: any) {
      console.error("Google login failed", err);
      setError("Google Login failed. Please try again or check your internet connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with modern abstract shapes */}
      <div className="absolute inset-0 bg-[#F0FDF4]">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[440px] w-full relative z-10">

        {/* Brand Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-xl shadow-green-500/20 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Sprout className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">AgriSmart</span>
          </h1>
          <p className="text-gray-500 font-medium">Your intelligent farming companion</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl shadow-gray-200/50 border border-white/50 ring-1 ring-gray-100">

          {!showOTP ? (
            <div className="animate-fade-in">
              {/* Login Method Toggle */}
              <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8 relative">
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${loginMethod === 'email' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
                    }`}
                />
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${loginMethod === 'phone' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Phone
                </button>
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${loginMethod === 'email' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Email
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                    {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                      {loginMethod === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      value={loginMethod === 'phone' ? phoneNumber : email}
                      onChange={(e) => loginMethod === 'phone' ? setPhoneNumber(e.target.value) : setEmail(e.target.value)}
                      placeholder={loginMethod === 'phone' ? "+91 98765 43210" : "farmer@example.com"}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Get OTP Code
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-sm text-gray-400 font-medium">Or</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && loginMethod !== 'phone' && loginMethod !== 'email' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                ) : (
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                )}
                Continue with Google
              </button>

            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Code</h2>
                <p className="text-gray-500 text-sm">
                  We sent a code to <br />
                  <span className="text-gray-900 font-semibold">{loginMethod === 'phone' ? phoneNumber : email}</span>
                </p>
              </div>

              <div className="mb-8">
                <input
                  autoFocus
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000 000"
                  className="w-full py-4 text-center text-3xl font-bold tracking-[0.5em] text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none placeholder:text-gray-300"
                />
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Login"}
              </button>

              <button
                onClick={() => setShowOTP(false)}
                className="w-full mt-4 py-3 text-gray-500 font-medium hover:text-gray-900 transition-colors text-sm"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?
            <button
              onClick={() => navigate('/action-selection')}
              className="ml-1 font-semibold text-green-600 hover:text-green-700 hover:underline transition-all"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
