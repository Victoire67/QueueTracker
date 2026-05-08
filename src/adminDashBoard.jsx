import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [office, setOffice] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const initializeAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setAdminUser(user);

        const { data, error } = await supabase
          .from('offices')
          .select('*')
          .eq('admin_id', user.id)
          .single();
        
        if (!error && data) {
          setOffice(data);
          setupRealtimeSubscription(data.id);
        }
      }
      setLoading(false);
    };

    const setupRealtimeSubscription = (officeId) => {
      const channel = supabase
        .channel(`admin-sync-${officeId}`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'offices', 
            filter: `id=eq.${officeId}` 
          },
          (payload) => {
            setOffice(payload.new);
            setIsProcessing(false); 
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    initializeAdmin();
  }, []);

  const handleQueueChange = async (delta) => {
    if (!office || isProcessing) return;
    setIsProcessing(true);
    const nextCount = Math.max(0, office.current_queue_count + delta);
    const { error } = await supabase
      .from('offices')
      .update({ current_queue_count: nextCount })
      .eq('id', office.id);
    if (error) {
      console.error("Queue Update Error:", error.message);
      setIsProcessing(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!office || isProcessing) return;
    setIsProcessing(true);
    const { error } = await supabase
      .from('offices')
      .update({ is_active: !office.is_active })
      .eq('id', office.id);
    if (error) {
      console.error("Status Toggle Error:", error.message);
      setIsProcessing(false);
    }
  };

  const fetchLogs = async () => {
    if (!office) return;
    const { data, error } = await supabase
      .from('office_logs')
      .select('*')
      .eq('office_id', office.id)
      .order('closed_at', { ascending: false });
    if (!error) setLogs(data);
  };

  useEffect(() => {
    if (activeTab === 'history') fetchLogs();
  }, [activeTab]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Establishing Secure Link...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex font-sans selection:bg-blue-500/30">
      
      {/* PROFESSIONAL SIDEBAR */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 p-8 flex flex-col h-screen sticky top-0">
        <div className="flex-1 overflow-y-hidden flex flex-col">
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tighter text-blue-500 italic">UniFlow</h2>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Management Suite</p>
          </div>
          
          <nav className="space-y-4 mb-10">
            <button 
              onClick={() => setActiveTab('current')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'current' 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-2' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <span className="text-lg font-normal">◈</span>
              Live Control
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'history' 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-2' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <span className="text-lg font-normal">▤</span>
              Queue Logs
            </button>
          </nav>

          {/* ADDED: LIVE QUEUE LIST TRACKER */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Queue Monitor</h3>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded uppercase animate-pulse">Syncing</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {office?.current_queue_count > 0 ? (
                Array.from({ length: office.current_queue_count }).map((_, index) => (
                  <div key={index} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                        <span className="text-blue-500 font-black text-[10px]">#{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-200">STUDENT_TICKET</p>
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Waiting for {index * 5}m</p>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping"></div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">No students currently<br/>in the queue.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Sync</span>
          </div>
          <p className="text-sm font-bold text-slate-200 truncate">{office?.officer_name || "Emmanuel"}</p>
          <p className="text-[10px] text-slate-600 truncate">{adminUser?.email}</p>
        </div>
      </aside>

      {/* MAIN CONSOLE */}
      <main className="flex-1 p-16 overflow-y-auto">
        <header className="flex justify-between items-start mb-20">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tight">{office?.officer_name || "Emmanuel"}'s Desk</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-lg border border-blue-500/20 uppercase tracking-widest">
                Service: {office?.service_title || 'General'}
              </span>
            </div>
          </div>

          <button 
            onClick={handleStatusToggle}
            disabled={isProcessing}
            className={`group relative px-10 py-5 rounded-[2rem] font-black transition-all active:scale-95 border-2 ${
              office?.is_active 
              ? 'bg-green-500/5 text-green-500 border-green-500/20 hover:bg-green-500/10' 
              : 'bg-red-600 text-white border-red-700 shadow-2xl hover:bg-red-500 hover:shadow-red-900/40'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm tracking-tighter">
                {isProcessing ? 'TRANSMITTING...' : office?.is_active ? '● OFFICE IS OPEN' : '○ OFFICE IS CLOSED'}
              </span>
              <span className="text-[9px] opacity-60 font-bold mt-1 uppercase tracking-widest">Toggle Status</span>
            </div>
          </button>
        </header>

        {activeTab === 'current' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 max-w-7xl">
            
            <div className="xl:col-span-2 bg-white rounded-[4rem] p-24 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', size: '20px 20px' }}></div>
              <h2 className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs mb-16">Live Student Counter</h2>
              <div className="flex items-center justify-between relative z-10">
                <button onClick={() => handleQueueChange(-1)} disabled={isProcessing} className="w-32 h-32 rounded-[2.5rem] bg-slate-100 text-slate-900 text-6xl hover:bg-slate-200 transition-all active:scale-90 shadow-lg disabled:opacity-30">—</button>
                <div className="flex flex-col items-center">
                  <span className={`text-[16rem] leading-none font-black tabular-nums transition-colors duration-500 ${isProcessing ? 'text-blue-600 animate-pulse' : 'text-slate-950'}`}>
                    {office?.current_queue_count ?? 0}
                  </span>
                  <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-sm mt-4 italic">Students</p>
                </div>
                <button onClick={() => handleQueueChange(1)} disabled={isProcessing} className="w-32 h-32 rounded-[2.5rem] bg-blue-600 text-white text-6xl hover:bg-blue-700 shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all active:scale-90 disabled:opacity-30">+</button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-xl">
                <h3 className="text-slate-500 font-black text-[11px] uppercase tracking-widest mb-8">Queue Density</h3>
                <div className="w-full bg-slate-950 h-8 rounded-2xl border border-slate-800 p-1.5 flex items-center">
                  <div className={`h-full rounded-xl transition-all duration-1000 ease-out shadow-lg ${office?.current_queue_count > 15 ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-blue-700 to-blue-400'}`}
                    style={{ width: `${Math.min((office?.current_queue_count / 20) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl">
            <h2 className="text-3xl font-black mb-10">Historical Traffic</h2>
            <div className="space-y-4">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-6 bg-slate-950/50 rounded-2xl border border-slate-800/30">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Session Closed</p>
                    <p className="font-mono text-sm">{new Date(log.closed_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Final Count</p>
                    <p className="text-xl font-black text-blue-500">{log.final_queue_count} students</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-600 italic py-20 text-center">No closed sessions found in the archive.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;