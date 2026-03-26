import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, Leaf, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') || 'login';

  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [password, setPassword] = useState('');

  // Auto-switch text based on mode
  const isLogin = mode === 'login';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);
    // Simulate network request due to Google SMTP BadCredentials error
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setIsLoading(false);
      setStep(2);
      // Mock Email Simulation
      alert(`[MOCK EMAIL SERVER]\n\nAn OTP has been sent to ${email}.\n\nYour code is: ${code}`);
    }, 1200);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      alert("Invalid OTP. Please check the code and try again.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 800);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Store mock user session if needed
      localStorage.setItem('ecologix_user', email);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-green-600">
           <Leaf className="w-12 h-12" />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {isLogin ? 'Sign in to your account' : 'Create a green account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button onClick={() => { setMode(isLogin ? 'signup' : 'login'); setStep(1); }} className="font-medium text-green-600 hover:text-green-500">
            {isLogin ? 'start your 14-day free trial' : 'sign in to your existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Continue with Email' : 'Send Verification Code')}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                 <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-2" />
                 <h3 className="text-lg font-bold text-gray-900">Check your email</h3>
                 <p className="text-sm text-gray-500 mt-1">We sent a 6-digit verification code to <br/><span className="font-semibold text-gray-700">{email}</span></p>
              </div>
              
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                  Verification Code
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full text-center tracking-widest text-2xl py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 font-mono transition-all"
                    placeholder="000000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
              </button>
            </form>
          )}

          {/* STEP 3: PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="text-center mb-6">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6 text-green-600" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">Secure your account</h3>
                 <p className="text-sm text-gray-500 mt-1">{isLogin ? 'Enter your password to log in.' : 'Create a new password for your account.'}</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || password.length < 6}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>{isLogin ? 'Log In to Dashboard' : 'Create Account & Continue'} <ArrowRight className="w-4 h-4"/></>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
