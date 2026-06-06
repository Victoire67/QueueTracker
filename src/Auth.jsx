

// --- SUPABASE CONFIGURATION ---
// Replace these with your actual Project URL and Anon Key from Settings > API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        const targetTable = role === 'admin' ? 'admins' : 'students';
        const { error: profileError } = await supabase
          .from(targetTable)
          .insert([{ id: authData.user.id, full_name: fullName, role: role }]);

        if (profileError) throw profileError;
        alert('Registration successful! Verify your email to log in.');
        setIsSignUp(false);

      } else {
        // --- LOGIN & ROLE-BASED ROUTING ---
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });

        if (signInError) throw signInError;

        const userId = signInData.user.id;

        // 1. Check if user is an Admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('id', userId)
          .single();

        if (adminData) {
          navigate('/admin-dashboard');
          return;
        }

        // 2. If not admin, check if user is a Student
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('id', userId)
          .single();

        if (studentData) {
          navigate('/student-dashboard');
        } else {
          throw new Error("Profile not found. Please contact support.");
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* Left Visual Section */}
        <div className="md:w-1/2 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1000" 
            alt="University campus" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-700/80 backdrop-blur-[2px]"></div>
          <div className="relative z-10 h-full flex flex-col justify-between p-16 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-blue-700 font-black text-xl">U</span>
              </div>
              <span className="font-bold tracking-tight text-2xl uppercase text-white">UniFlow</span>
            </div>
            <div>
              <h2 className="text-5xl font-extrabold leading-tight mb-6">Manage your <br/>time better.</h2>
              <p className="text-blue-100 text-lg max-w-md">Real-time queue tracking for students and powerful management tools for campus staff.</p>
            </div>
            <p className="text-sm font-medium text-blue-200">© 2026 UniFlow System</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 p-10 md:p-20">
          <div className="max-w-sm mx-auto">
            <header className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-500 font-medium">
                {isSignUp ? 'Choose your role to get started.' : 'Sign in to access your dashboard.'}
              </p>
            </header>

            <form onSubmit={handleAuth} className="space-y-5">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`py-2.5 text-xs font-black rounded-xl transition-all ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >STUDENT</button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`py-2.5 text-xs font-black rounded-xl transition-all ${role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >ADMIN / STAFF</button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.97] disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <footer className="mt-10 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-500 text-sm font-medium">
                {isSignUp ? 'Already a member?' : 'New to UniFlow?'}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4"
                >
                  {isSignUp ? 'Log in' : 'Create an account'}
                </button>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;