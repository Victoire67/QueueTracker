import {  useOutletContext } from "react-router";
function OfficeList() {
    let user = useOutletContext()
    let myQueues = user.queues
    let offices = user.offices
    
    console.log(offices)
  return (
    <div className=" m-auto" >

      <section className="mb-12 w-full">
        <h3 className="text-xl font-black text-slate-900 mb-6">
          My Active Sessions
        </h3>
        {myQueues.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-red-500">
            {myQueues.map((q) => (
              <div
                key={q.id}
                className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl flex justify-between items-center"
              >
                <div>
                  <h4 className="text-xl font-black italic">
                    #{String(q.current_queue_count).padStart(2, "0")}
                  </h4>
                  <p className="font-bold">{q.service_title || q.name}</p>
                </div>
                <button
                  onClick={() => leaveQueue(q.id)}
                  className="bg-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                  Leave
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
            <p className="text-slate-500">You are not in any queue</p>
          </div>
        )}
      </section>

      <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">
        Available Offices
      </h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {offices.map((office) => {
          const isInQueue = myQueues.some((q) => q.id === office.id);
          const isFull =
            office.current_queue_count >= (office.max_capacity || 20);
          const waitTime = office.current_queue_count * 5;
          const capacityPercentage = Math.min(
            (office.current_queue_count / (office.max_capacity || 20)) * 100,
            100,
          );
          const isOpen = office.is_active;

          return (
            <div
              key={office.id}
              className={`group relative bg-white rounded-[2.5rem] border p-8 transition-all duration-500 overflow-hidden ${isOpen ? "border-slate-100 shadow-sm hover:shadow-xl" : "opacity-75 grayscale-[0.5]"}`}
            >
              <div className="flex justify-between items-start mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isOpen ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  <svg
                    className="w-7 h-7"
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
                <div
                  className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase ${isOpen ? "border-green-100 text-green-600 bg-green-50" : "border-slate-200 text-slate-400 bg-slate-50"}`}
                >
                  {isOpen ? "Live" : "Closed"}
                </div>
              </div>

              <div className="mb-8">
                <h4
                  className={`text-xl font-black ${isOpen ? "text-slate-900" : "text-slate-400"}`}
                >
                  {office.service_title || office.name}
                </h4>
                <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                  {office.location || "Campus"}
                </p>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Queue Density</span>
                  <span>
                    {office.current_queue_count} / {office.max_capacity || 20}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${!isOpen ? "bg-slate-300" : isFull ? "bg-red-500" : "bg-blue-600"}`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-sm font-black italic">
                    {isOpen ? `~${waitTime} min` : "--"}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Wait Time
                  </span>
                </div>
                <button
                  onClick={() =>
                    isInQueue ? leaveQueue(office.id) : joinQueue(office)
                  }
                  disabled={!isOpen && !isInQueue}
                  className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase transition-all ${isInQueue ? "bg-red-100 text-red-600" : isOpen ? "bg-slate-950 text-white shadow-xl" : "bg-slate-50 text-slate-300"}`}
                >
                  {isInQueue
                    ? "Leave Line"
                    : isOpen
                      ? "Secure Spot"
                      : "Unavailable"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OfficeList;
