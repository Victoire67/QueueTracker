import React, { useState, useEffect } from "react";
import { supabase } from "./Auth"; // or wherever your supabase client is defined

const StudentDashboard = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQueue, setActiveQueue] = useState(null);

  useEffect(() => {
    fetchOffices();
    // Setting up real-time subscription
    const subscription = supabase
      .channel("office-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "offices" },
        (payload) => {
          setOffices((current) =>
            current.map((office) =>
              office.id === payload.new.id ? payload.new : office,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOffices = async () => {
    const { data, error } = await supabase.from("offices").select("*");
    if (!error) setOffices(data);
    setLoading(false);
  };

  const joinQueue = async (officeId) => {
    // Logic to insert into queue_entries and update local state
    alert(
      "Joined the queue! You will receive a notification when it's your turn.",
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">U</span>
          </div>
          <span className="font-bold text-xl tracking-tight">UniFlow</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Live Queues
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            My Profile
          </button>
        </nav>

        <button className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Campus Overview
            </h1>
            <p className="text-slate-500 font-medium">
              Real-time status of all university service offices.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <img
              src="https://i.pravatar.cc/150?u=victoire"
              className="w-10 h-10 rounded-xl"
              alt="avatar"
            />
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-900 leading-none">
                Victoire Rugamba
              </p>
              <p className="text-[10px] font-bold text-blue-600 uppercase mt-1">
                Student Account
              </p>
            </div>
          </div>
        </header>

        {/* Highlight Section: Active Queue */}
        {activeQueue ? (
          <div className="bg-blue-600 rounded-[2rem] p-8 text-white mb-10 shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-2">
                  Current Position
                </p>
                <h2 className="text-5xl font-black italic">#04</h2>
                <p className="mt-2 text-lg font-medium">
                  Finance Office - Main Wing
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-[200px]">
                <p className="text-xs font-bold uppercase mb-1">
                  Est. Wait Time
                </p>
                <p className="text-3xl font-black">12 MINS</p>
              </div>
              <button className="px-8 py-4 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition shadow-lg">
                Leave Queue
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center mb-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              You are not in any queue
            </h3>
            <p className="text-slate-500 text-sm">
              Select an office below to join a line virtually.
            </p>
          </div>
        )}

        {/* Office Grid */}
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Available Offices
          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded uppercase">
            Live
          </span>
        </h3>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offices.map((office) => (
            <div
              key={office.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-2xl ${office.is_active ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${office.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {office.is_active ? "Open" : "Closed"}
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-1">
                {office.name}
              </h4>
              <p className="text-sm text-slate-500 mb-6">{office.location}</p>

              <div className="flex items-center justify-between py-4 border-t border-slate-50">
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {office.current_queue_count}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Waiting now
                  </p>
                </div>
                <button
                  onClick={() => joinQueue(office.id)}
                  disabled={!office.is_active}
                  className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 disabled:bg-slate-200 transition-colors shadow-lg shadow-slate-200"
                >
                  Join Line
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
