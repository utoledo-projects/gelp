"use client";

import { useState } from "react";
import { Gamepad2, MessageSquare, Activity } from "lucide-react";

const handleScoreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  let val = e.target.value.replace(/[^0-9.]/g, '');

  const dotCount = (val.match(/\./g) || []).length;
  if (dotCount > 1) {
    val = val.slice(0, val.lastIndexOf('.'));
  }

  const match = val.match(/^(10|[0-9])?(\.[0-9]?)?/);
  let cleanVal = match ? match[0] : "";

  if (cleanVal.startsWith("10.")) {
    const parts = cleanVal.split(".");
    if (parts[1] && parts[1] !== "0") {
      cleanVal = "10."; 
    }
  }

  e.target.value = cleanVal;
};

const handleReviewInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value.replace(/\D/g, '');               
  e.target.value = val.length > 1 ? val.replace(/^0+/, '') : val;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Form submitted");
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"game" | "review" | "activity">("game");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-indigo-400 uppercase">ADMIN PANEL</h1>
          <p className="text-zinc-500 font-medium">Create and manage feed posts.</p>
        </header>

        <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4">
          <TabButton 
            active={activeTab === "game"} 
            onClick={() => setActiveTab("game")} 
            icon={<Gamepad2 size={18} />} 
            label="Game Post" 
          />
          <TabButton 
            active={activeTab === "review"} 
            onClick={() => setActiveTab("review")} 
            icon={<MessageSquare size={18} />} 
            label="User Review" 
          />
          <TabButton 
            active={activeTab === "activity"} 
            onClick={() => setActiveTab("activity")} 
            icon={<Activity size={18} />} 
            label="Friend Activity" 
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          {activeTab === "game" && <GamePostForm />}
          {activeTab === "review" && <ReviewPostForm />}
          {activeTab === "activity" && <ActivityPostForm />}
        </div>

      </div>
    </main>
  );
}

function GamePostForm() {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="Game Title" placeholder="Enter game title..." />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Post Type Option</label>
          <select className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 text-white cursor-pointer">
            <option value="popular">Popular</option>
            <option value="release">Release</option>
            <option value="update">Update</option>
            <option value="recommendation">Recommendation</option>
          </select>
        </div>
      </div>
      
      <InputGroup label="Feed Image (URL)" placeholder="https://example.com/image.jpg" />
      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Feed Description</label>
        <textarea 
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm min-h-[100px] outline-none focus:border-indigo-500 placeholder:text-zinc-600 text-white" 
          placeholder="Enter a brief summary for the feed card..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="Score (0-10)" type="text" placeholder="0.0" onChange={handleScoreInput} />
        <InputGroup label="Review Count" type="text" placeholder="0" onChange={handleReviewInput} />
      </div>

      <SubmitButton />
    </form>
  );
}

function ReviewPostForm() {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="Username" placeholder="Enter reviewer username..." />
        <InputGroup label="Game Title" placeholder="Enter game name..." />
      </div>

      <InputGroup label="Avatar Image URL" placeholder="https://example.com/avatar.jpg" />
      <InputGroup label="User Rating (0-10)" type="text" placeholder="0.0" onChange={handleScoreInput} />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Review Content</label>
        <textarea 
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm min-h-[80px] outline-none focus:border-indigo-500 placeholder:text-zinc-600 text-white" 
          placeholder="Paste the review snippet here..."
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function ActivityPostForm() {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputGroup label="User Target" placeholder="Enter username..." />
      <InputGroup label="User Avatar URL" placeholder="https://example.com/avatar.jpg" />
      <InputGroup label="Game Name" placeholder="Enter game name..." />
      <SubmitButton />
    </form>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
        active ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InputGroup({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      <input 
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600 text-white" 
        {...props} 
      />
    </div>
  );
}

function SubmitButton() {
  return (
    <button 
      type="submit" 
      className="w-full mt-6 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.95] shadow-lg"
    >
      Publish Post
    </button>
  );
}