

function StudentHeader({ routeName, details , user , fullName }) {

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 w-full place-content-between">
    
      <div>
        <h1 className="text-3xl font-black text-slate-900">{"Student interface"}</h1>
        <p className="text-slate-500 font-medium">{"HEre is where you see teachers's offices"}</p>
      </div>
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <img
          src={`https://i.pravatar.cc/150?u=${user?.id}`}
          className="w-10 h-10 rounded-xl"
          alt="avatar"
        />
        <div className="pr-4">
          <p className="text-xs font-bold text-slate-900 leading-none">
            {fullName || user?.email}
          </p>
          <p className="text-[10px] font-bold text-blue-600 uppercase mt-1">
            Student Account
          </p>
        </div>
      </div>
    </header>
  );
}

export default StudentHeader;
