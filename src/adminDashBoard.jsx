import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AdminDashboard = () => {
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Load
    const fetchOffice = async () => {
      const { data } = await supabase.from('offices').select('*').limit(1).single();
      setOffice(data);
      setLoading(false);
    };
    fetchOffice();

    // 2. Real-time Sync
    // This ensures if another admin changes the count, your screen updates too.
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'offices' }, 
      (payload) => {
        setOffice(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- DATABASE ACTIONS ---

  // Update the number of people in line
  const updateQueue = async (change) => {
    const nextCount = Math.max(0, office.current_queue_count + change);
    const { error } = await supabase
      .from('offices')
      .update({ current_queue_count: nextCount })
      .eq('id', office.id);
    
    if (error) console.error("Update failed:", error.message);
  };

  // Toggle if the office is Open or Closed
  const toggleOffice = async () => {
    const { error } = await supabase
      .from('offices')
      .update({ is_active: !office.is_active })
      .eq('id', office.id);

    if (error) console.error("Toggle failed:", error.message);
  };

  if (loading) return <p className="text-white">Connecting to Office System...</p>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* Header with Live Status */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black">{office?.name}</h1>
          <p className="text-slate-400 mt-1">Management Console</p>
        </div>
        
        {/* INTERACTIVE TOGGLE */}
        <button 
          onClick={toggleOffice}
          className={`px-6 py-3 rounded-2xl font-bold transition ${
            office?.is_active 
            ? 'bg-green-500/10 text-green-500 border border-green-500/50' 
            : 'bg-red-500 text-white shadow-lg shadow-red-900/20'
          }`}
        >
          {office?.is_active ? '● Office is Open' : '○ Office is Closed'}
        </button>
      </div>

      {/* QUEUE CONTROLLER */}
      <div className="max-w-xl mx-auto bg-white rounded-[3rem] p-16 text-center shadow-2xl">
        <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">Manage Queue</h2>
        
        <div className="flex items-center justify-around">
          <button 
            onClick={() => updateQueue(-1)}
            className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-900 text-3xl hover:bg-slate-200 active:scale-90 transition"
          >
            —
          </button>

          <div className="flex flex-col">
            <span className="text-9xl font-black text-slate-900 tabular-nums">
              {office?.current_queue_count}
            </span>
            <span className="text-slate-400 font-bold">Students in Line</span>
          </div>

          <button 
            onClick={() => updateQueue(1)}
            className="w-20 h-20 rounded-3xl bg-blue-600 text-white text-3xl hover:bg-blue-700 active:scale-90 shadow-xl shadow-blue-200 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;