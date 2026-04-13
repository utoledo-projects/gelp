'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GameResult {
  id: string;
  title: string;
}

export default function DatabaseSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
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
                className="block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                {game.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
