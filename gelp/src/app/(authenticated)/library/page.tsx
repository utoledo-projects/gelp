"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GenreTag from "@/components/GenreTag";

interface Game {
  _id: string;
  title: string;
  coverArt: string;
  developer: string;
  genre: string[];
  releaseDate: string;
}

export default function LibraryPage() {
  const [library, setLibrary] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch('/api/library?skip=0&limit=100');
        if (!res.ok) throw new Error("Failed to fetch library");
        const data = await res.json();
        setLibrary(data.library);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch library");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();

    // Handle browser back/forward navigation
    const handlePopState = () => {
      setLoading(true);
      fetchLibrary();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl mb-8'>My Library</h1>
          <p>Loading library...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl mb-8'>My Library</h1>
          <p className='text-red-500'>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl mb-8'>My Library ({total} Game{total !== 1 ? 's' : ''})</h1>
        {library.length === 0 ? (
          <p>Your library is empty. <Link href='/' className='text-blue-400 hover:underline'>Browse games</Link> to add some!</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {library.map((game) => (
              <Link 
                key={game._id} 
                href={`/game/${game._id}`}
                className='bg-neutral-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200'
              >
                <div className='aspect-[3/4] relative'>
                  <Image
                    src={game.coverArt}
                    alt={game.title}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h2 className='text-lg font-semibold truncate'>{game.title}</h2>
                  <p className='text-sm text-gray-400'>{game.developer}</p>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {game.genre.slice(0, 3).map((genre) => (
                      <GenreTag key={genre} genre={genre} link={false}/>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
