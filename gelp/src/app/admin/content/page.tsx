"use client";

import { useState, useEffect } from "react";
import { Gamepad2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminContentPage() {
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [displayStatus, setDisplayStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    if (status) {
      setDisplayStatus(status);
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contentfeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error || "Failed to publish" });
        return;
      }

      setStatus({ type: 'success', msg: "Post published successfully!" });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      setStatus({ type: 'error', msg: "Network error occurred." });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out transform 
        ${status ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0 pointer-events-none"}`}>
        
        {displayStatus && (
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full border shadow-2xl backdrop-blur-xl
            ${displayStatus.type === 'success' 
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
              : "bg-red-500/10 border-red-500/40 text-red-400"}`}>
            {displayStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold tracking-wide">{displayStatus.msg}</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-indigo-400 uppercase">ADMIN PANEL</h1>
          <p className="text-zinc-500 font-medium">Create and manage global game feed posts.</p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-8 text-indigo-400 border-b border-zinc-800 pb-4">
            <Gamepad2 size={20} />
            <span className="font-bold uppercase tracking-wider">New Game Post</span>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputGroup name="title" label="Title" placeholder="Optional Title..." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup name="gameId" label="Game ID" placeholder="69cc1da4d6414217e7192a06" required />

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Post Type</label>
                <select 
                  name="postType"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm outline-none focus:border-indigo-400 text-white cursor-pointer h-[46px] w-full"
                  defaultValue=""
                >
                  <option value="">None</option>
                  <option value="popular">Popular</option>
                  <option value="release">Release</option>
                  <option value="update">Update</option>
                  <option value="recommendation">Recommendation</option>
                </select>
              </div>
            </div>

            <InputGroup name="imageUrl" label="Feed Image (URL)" placeholder="Optional Image URL..." />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider text-zinc-500">Feed Summary</label>
              <textarea 
                name="summary"
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm min-h-[120px] outline-none focus:border-indigo-400 text-white placeholder:text-zinc-600 transition-all" 
                placeholder="Optional summary for the feed card..."
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20">
              Publish Post
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function InputGroup({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      <input 
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm outline-none focus:border-indigo-400 text-white transition-colors placeholder:text-zinc-600 w-full" 
        {...props} 
      />
    </div>
  );
}