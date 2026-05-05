import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">UniFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/auth" 
            className="text-sm font-semibold px-4 py-2 text-slate-700 hover:text-blue-600 transition"
          >
            Log in
          </Link>
          <Link 
            to="/auth" 
            className="text-sm font-semibold px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition shadow-md"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Real-time updates
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Stop waiting <br /> 
              <span className="text-blue-600">in circles.</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Track office queues across campus in real-time. Know exactly when it's your turn to enter without standing in long hallways.
            </p>

            <div className="flex flex-col sm:row gap-4 pt-4">
              <Link 
                to="/auth" 
                className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-200 text-center"
              >
                Get Started Now
              </Link>
              <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                View Live Queues
              </button>
            </div>

            {/* Social Proof Area */}
            <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/100?u=${i+20}`} 
                      alt="Student user" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Join <span className="font-bold text-slate-900">500+ students</span> managing their time better.
              </p>
            </div>
          </div>

          {/* Right Side Visuals */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                alt="Students in university hallway" 
                className="w-full h-[550px] object-cover"
              />
              
              {/* Floating Dashboard Element */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                <div className="bg-white/95 backdrop-blur p-5 rounded-2xl shadow-2xl flex items-center gap-5 w-full transform translate-y-2">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Main Registrar Office</p>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">4 People in queue</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/30 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;