"use client";

import { useState, useCallback } from "react";

import { useRef } from 'react';

/* ─── Types ─────────────────────────────────────────────── */
interface IGDBGame {
  id: number;
  name: string;
  summary: string;
  first_release_date?: number;
  cover?: { url: string };
  genres?: { name: string }[];
  involved_companies?: { company: { name: string }; developer: boolean }[];
  total_rating?: number;
}

interface GameForm {
  title: string;
  developer: string;
  genre: string;
  releaseDate: string;
  coverArt: string;
  icon: string;
  igdbID: string;
  summary: string;
}

type Mode = "igdb-search" | "igdb-top" | "manual";
type Status = { type: "success" | "error"; message: string } | null;

/* ─── Helpers ────────────────────────────────────────────── */
function igdbToForm(g: IGDBGame): GameForm {
  const devCompany = g.involved_companies?.find((c) => c.developer)?.company.name ?? "";
  const releaseDate = g.first_release_date
    ? new Date(g.first_release_date * 1000).toISOString().split("T")[0]
    : "";
  const coverUrl = g.cover?.url
    ? g.cover.url.replace("t_thumb", "t_cover_big").replace("//", "https://")
    : "";
  return {
    title: g.name,
    developer: devCompany,
    genre: g.genres?.map((x) => x.name).join(", ") ?? "",
    releaseDate,
    coverArt: coverUrl,
    icon: coverUrl,
    igdbID: String(g.id),
    summary: g.summary ?? "",
  };
}

function emptyForm(): GameForm {
  return { title: "", developer: "", genre: "", releaseDate: "", coverArt: "", icon: "", igdbID: "", summary: "" };
}

/* ─── Sub-components ─────────────────────────────────────── */
function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  const pct = Math.round(rating / 10) / 10;
  return <span className="text-indigo-400 text-xs font-bold">{pct.toFixed(1)}/10</span>;
}

function GameCard({ game, onSelect }: { game: IGDBGame; onSelect: (g: IGDBGame) => void }) {
  const cover = game.cover?.url
    ? game.cover.url.replace("t_thumb", "t_cover_big").replace("//", "https://")
    : null;

  return (
    <button
      onClick={() => onSelect(game)}
      className="group relative flex gap-3 p-3 rounded-xl border border-zinc-800 hover:border-indigo-500 bg-zinc-900 hover:bg-zinc-800 transition-all text-left w-full"
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={game.name} className="w-12 h-16 object-cover rounded-lg shrink-0 border border-zinc-700" />
      ) : (
        <div className="w-12 h-16 rounded-lg bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
          <span className="text-zinc-600 text-xs font-bold">N/A</span>
        </div>
      )}
      <div className="flex flex-col justify-between min-w-0">
        <div>
          <p className="text-white font-bold text-sm truncate">{game.name}</p>
          <p className="text-zinc-500 text-xs mt-0.5 truncate">
            {game.involved_companies?.find((c) => c.developer)?.company.name ?? "Unknown Dev"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {game.first_release_date && (
            <span className="text-zinc-500 text-xs font-bold">
              {new Date(game.first_release_date * 1000).getFullYear()}
            </span>
          )}
          <StarRating rating={game.total_rating} />
        </div>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-indigo-500 text-xs font-bold tracking-widest">SELECT →</span>
      </div>
    </button>
  );
}

function FormField({
  label, name, value, onChange, type = "text", placeholder, hint, multiline = false,
}: {
  label: string; name: keyof GameForm; value: string;
  onChange: (name: keyof GameForm, val: string) => void;
  type?: string; placeholder?: string; hint?: string; multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-400 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-400 transition-all"
        />
      )}
      {hint && <p className="text-zinc-600 text-[10px] font-bold uppercase">{hint}</p>}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function AdminImportPage() {
  const [mode, setMode] = useState<Mode>("igdb-search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IGDBGame[]>([]);
  const [searching, setSearching] = useState(false);
  const [topCount, setTopCount] = useState("10");
  const [topResults, setTopResults] = useState<IGDBGame[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [form, setForm] = useState<GameForm>(emptyForm());
  const [editingForm, setEditingForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const updateForm = useCallback((name: keyof GameForm, val: string) => {
    setForm((f) => ({ ...f, [name]: val }));
  }, []);

  const handleSelectGame = (g: IGDBGame) => {
    setForm(igdbToForm(g));
    setEditingForm(true);
    setStatus(null);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/igdb/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSearchResults(data);
    } catch (e: unknown) {
      setStatus({ type: "error", message: e instanceof Error ? e.message : "Search failed" });
    } finally {
      setSearching(false);
    }
  };

  const handleLoadTop = async () => {
    setLoadingTop(true);
    setTopResults([]);
    try {
      const res = await fetch(`/api/igdb/top?limit=${topCount}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTopResults(data);
    } catch (e: unknown) {
      setStatus({ type: "error", message: e instanceof Error ? e.message : "Failed to load top games" });
    } finally {
      setLoadingTop(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload = {
        ...form,
        genre: form.genre.split(",").map((s) => s.trim()).filter(Boolean),
        igdbID: form.igdbID ? parseInt(form.igdbID) : undefined,
      };
      const res = await fetch("/api/games/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setStatus({ type: "success", message: `"${form.title}" added to the database successfully.` });
      setForm(emptyForm());
      setEditingForm(false);
    } catch (e: unknown) {
      setStatus({ type: "error", message: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const currentResults = mode === "igdb-search" ? searchResults : topResults;
  void currentResults;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left: Source + Results ── */}
        <div className="flex flex-col gap-6">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            {([
              { key: "igdb-search", label: "Search IGDB" },
              { key: "igdb-top", label: "Top Games" },
              { key: "manual", label: "Manual Entry" },
            ] as { key: Mode; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setStatus(null); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  mode === key
                    ? "bg-zinc-800 text-indigo-400 shadow-lg"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* IGDB Search */}
          {mode === "igdb-search" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search for a game..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-400 transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-lg shadow-indigo-600/20"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>
              {searching && (
                <div className="text-center py-10 text-zinc-500 text-sm font-bold animate-pulse uppercase tracking-widest">Querying IGDB...</div>
              )}
              {searchResults.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    {searchResults.length} results — click to populate
                  </p>
                  <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                    {searchResults.map((g) => <GameCard key={g.id} game={g} onSelect={handleSelectGame} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* IGDB Top */}
          {mode === "igdb-top" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Pull top</label>
                <input
                  type="number" value={topCount} onChange={(e) => setTopCount(e.target.value)}
                  min={1} max={50}
                  className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 transition-colors text-center font-bold"
                />
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">games</label>
                <button
                  onClick={handleLoadTop} disabled={loadingTop}
                  className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-lg shadow-indigo-600/20"
                >
                  {loadingTop ? "Loading..." : "Load"}
                </button>
              </div>
              {loadingTop && (
                <div className="text-center py-10 text-zinc-500 text-sm font-bold animate-pulse uppercase tracking-widest">Fetching top games from IGDB...</div>
              )}
              {topResults.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Top {topResults.length} games — click to populate
                  </p>
                  <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                    {topResults.map((g) => <GameCard key={g.id} game={g} onSelect={handleSelectGame} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual */}
          {mode === "manual" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                Manually enter game details. All required fields must be filled before saving.
              </p>
              <button
                onClick={() => { setForm(emptyForm()); setEditingForm(true); setStatus(null); }}
                className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
              >
                + New Manual Entry
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Form ── */}
        <div ref={formRef} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Game Details</h2>
            {editingForm && (
              <button
                onClick={() => { setForm(emptyForm()); setEditingForm(false); setStatus(null); }}
                className="text-xs font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest"
              >
                Clear ✕
              </button>
            )}
          </div>

          {status && !editingForm && (
            <div className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-widest shadow-2xl ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "bg-red-500/10 border-red-500/40 text-red-400"
            }`}>
              {status.type === "success" ? "✓ " : "✗ "}{status.message}
            </div>
          )}

          {!editingForm ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl min-h-[400px] bg-zinc-900/20">
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest text-center px-8 leading-loose">
                Select a game from the left panel<br />or start a manual entry
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-6 border border-zinc-800 rounded-2xl bg-zinc-900 shadow-2xl">
              {form.coverArt && (
                <div className="flex gap-4 items-center pb-4 border-b border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverArt} alt="Cover" className="w-16 h-20 object-cover rounded-lg border border-zinc-700 shrink-0" />
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <p className="text-white mb-1 font-bold">{form.title || "Untitled"}</p>
                    <p>IGDB ID: {form.igdbID || "—"}</p>
                    <p className="mt-2 text-indigo-400/80">All fields are editable below.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <FormField label="Title *" name="title" value={form.title} onChange={updateForm} placeholder="Game title" />
                <FormField label="Developer *" name="developer" value={form.developer} onChange={updateForm} placeholder="Developer name" />
                <FormField label="Genre(s)" name="genre" value={form.genre} onChange={updateForm} placeholder="Action, RPG, Strategy..." hint="Comma-separated list" />
                <FormField label="Summary" name="summary" value={form.summary} onChange={updateForm} placeholder="Game summary..." multiline />
                <FormField label="Release Date *" name="releaseDate" value={form.releaseDate} onChange={updateForm} type="date" />
                <FormField label="Cover Art URL" name="coverArt" value={form.coverArt} onChange={updateForm} placeholder="https://..." />
                <FormField label="Icon URL" name="icon" value={form.icon} onChange={updateForm} placeholder="https://..." hint="Defaults to cover art if left same" />
                <FormField label="IGDB ID" name="igdbID" value={form.igdbID} onChange={updateForm} placeholder="Optional — leave blank for manual entries" />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.developer || !form.releaseDate}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-40 mt-4 uppercase tracking-widest text-sm"
              >
                {saving ? "Saving..." : "Add to Database"}
              </button>

              {status && (
                <div className={`mt-2 p-4 rounded-lg border text-xs font-bold uppercase tracking-widest ${
                  status.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : "bg-red-500/10 border-red-500/40 text-red-400"
                }`}>
                  {status.type === "success" ? "✓ " : "✗ "}{status.message}
                </div>
              )}
            </div>
          )}

          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
            Fields marked * are required. IGDB imports auto-fill all fields — you may edit before saving.
          </p>
        </div>
      </div>
    </div>
  );
}
