import React, { useState } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const toggleMode = () => {
    setError(null);
    setIsLogin(!isLogin);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // On success, Firebase onAuthStateChanged hook updates auth state
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#e1f5fe] via-[#d1e9fc] to-[#b8daf7]">
  {/* Background with layered soft waves */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 1440 800"
    >
      <defs>
        <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#87CEFA" />
          <stop offset="100%" stopColor="#B0E2FF" />
        </linearGradient>
        <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5FAFE" />
        </linearGradient>
        <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6F7FF" />
          <stop offset="100%" stopColor="#B3E0FF" />
        </linearGradient>
      </defs>

      {/* Base sky layer */}
      <path
        fill="url(#wave1)"
        d="M0,0 L0,800 L720,800 Q600,400 780,0 Z"
        className="animate-wave"
      />

      {/* White misty wave */}
      <path
        fill="url(#wave2)"
        opacity="0.65"
        d="M720,0 C880,220 1000,350 880,500 
           C820,600 800,700 780,800 
           L1440,800 L1440,0 Z"
        className="animate-wave-delay-1"
      />

      {/* Extra soft wave for blend */}
      <path
        fill="url(#wave3)"
        opacity="0.3"
        d="M740,0 C920,260 1020,400 900,580 
           C860,640 820,720 780,800 
           L1440,800 L1440,0 Z"
        className="animate-wave-delay-2"
      />
    </svg>
  </div>

  {/* Glassmorphic Card with Enhanced Styling */}
  <div className="relative bg-white/50 backdrop-blur-lg border border-white/60 rounded-3xl shadow-2xl max-w-md w-full p-8 transition-all duration-300 hover:shadow-3xl hover:scale-[1.03] hover:bg-white/60">
  <h2 className="text-4xl font-bold text-center mb-6 text-blue-600 drop-shadow-md animate-fade-in">
  {isLogin ? "Welcome Back" : "Join the Community"}
</h2>



    {error && (
      <div className="mb-6 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-5 py-2.5 rounded-xl shadow-lg animate-pulse">
        <strong className="font-medium">Oops! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )}

    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <input
        type="email"
        placeholder="Email address"
        required
        value={email}
        onChange={handleEmailChange}
        className="px-6 py-3.5 rounded-2xl bg-white/90 border border-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500 text-gray-900 shadow-inner transition-all duration-200"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={handlePasswordChange}
        className="px-6 py-3.5 rounded-2xl bg-white/90 border border-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500 text-gray-900 shadow-inner transition-all duration-200"
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-600 to-blue-400 hover:from-blue-400 hover:to-sky-600 text-white font-semibold py-3.5 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-blue-300"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </form>

    <div className="mt-7 flex items-center justify-center space-x-4">
      <div className="h-px w-20 bg-sky-100" />
      <p className="text-sky-800 font-semibold">or</p>
      <div className="h-px w-20 bg-sky-100" />
    </div>

    <button
      onClick={handleGoogleSignIn}
      className="mt-6 w-full flex items-center justify-center space-x-4 bg-white/95 text-gray-800 py-3.5 rounded-2xl shadow-md font-medium hover:bg-gray-50/90 transition-all duration-200 border border-sky-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" className="mr-3">
        <path fill="#FFC107" d="M43.6 20.5h-3.8v-.1h-18v7.3h11.4c-1 4.4-4.6 7.6-9 7.6-5.2 0-9.6-4.2-9.6-9.4s4.3-9.4 9.6-9.4c2.5 0 4.6.9 6.3 2.4l4.5-4.5c-3-2.7-7-4.3-10.8-4.3-9.3 0-16.9 7.7-16.9 17.1s7.7 17.1 16.9 17.1c9.7 0 16.9-6.8 16.9-16.3.1-1-.1-1.8-.2-2.4z"/>
        <path fill="#FF3D00" d="M6.3 14.1l6.1 4.5c1.7-3.3 5.3-5.3 9.6-5.3 2.5 0 4.6.9 6.3 2.4l4.5-4.5C24.3 8 19 6 13.8 6 9.8 6 6.3 8.4 6.3 14.1z"/>
        <path fill="#4CAF50" d="M39.7 20.6l-4.5 4.5c-1.2-1.2-3-2-5.4-2-3.9 0-7.1 3.2-7.1 7.1 0 3.9 3.2 7.1 7.1 4.1 0 7.1-3.5 7.1-7.6v-.5h-7.1v-4.1h12.2v.4c0 7-5.4 12.6-12.2 12.6-7 0-12.7-5.8-12.7-12.9 0-7 5.7-12.9 12.7-12.9 3.3 0 6.3 1.3 8.5 3.4z"/>
      </svg>
      <span>Sign in with Google</span>
    </button>

    <p className="mt-6 text-center text-sky-900 font-medium">
      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
      <button
        onClick={toggleMode}
        className="underline text-blue-600 hover:text-blue-700 transition-colors duration-200"
        type="button"
      >
        {isLogin ? "Sign Up" : "Login"}
      </button>
    </p>
  </div>
</div>


  );
};

export default Login;
