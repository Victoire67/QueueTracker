import {  useOutletContext } from "react-router";

function ProfileSettings() {
 let user = useOutletContext()
 let updateProfile = user.updateProfile;
 let fullName = user.fullName
 let updating = user.updating
  return (
    <div className="max-w-2xl bg-white rounded-[2.5rem] border border-slate-100 p-10">
      <h2 className="text-2xl font-black mb-10">Profile Settings</h2>
      <form onSubmit={updateProfile} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 border rounded-2xl px-5 py-4"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings;
