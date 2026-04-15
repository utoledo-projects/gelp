'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GameResult {
  id: string;
  title: string;
  coverArt: string;
}

export default function DatabaseSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load images when results change
  useEffect(() => {
    const newLoadedImages = new Set(loadedImages);
    const newFailedImages = new Set(failedImages);

    results.forEach((game) => {
      if (!loadedImages.has(game.id) && !failedImages.has(game.id)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(game.id));
        };
        img.onerror = () => {
          setFailedImages((prev) => new Set(prev).add(game.id));
        };
        img.src = game.coverArt;
      }
    });
  }, [results]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      setLoadedImages(new Set());
      setFailedImages(new Set());
      return;
    }

    // Debounce: Wait 1 second (1000ms) after the last keystroke
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setShowDropdown(true)}
        placeholder="Search games..."
        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-neutral-400"
      />
      
      {isLoading && <div className="absolute right-3 top-2.5 text-xs text-neutral-500">Searching...</div>}

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden">
          {results.map((game) => (
            <li key={game.id}>
              <Link
                href={`/game/${game.id}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                {loadedImages.has(game.id) ? (
                  <img
                    src={game.coverArt}
                    alt={`${game.title} cover`}
                    className="w-12 h-16 object-cover rounded border border-zinc-700 shrink-0"
                  />
                ) : failedImages.has(game.id) ? (
                  <div className="w-12 h-16 rounded border border-zinc-700 shrink-0 bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                    🎮
                  </div>
                ) : (
                  <div className="w-12 h-16 rounded border border-zinc-700 shrink-0 bg-zinc-800 animate-pulse" />
                )}
                <span>{game.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
