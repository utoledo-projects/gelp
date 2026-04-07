"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FeedPost from "@/components/feed/FeedPost";
import FeedReviewPost from "@/components/feed/FeedReviewPost";
import FeedFriendActivity from "@/components/feed/FeedFriendActivity";

export default function SimpleDevPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const isFetching = useRef(false);
  const limit = 100;

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/useractivity");
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data = await res.json();
      setActivities(data);
    } catch (err: any) {
      console.error("Activity Error:", err.message);
    }
  }, []);

  const fetchFeed = useCallback(async () => {
    if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/contentfeed?skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch feed");

      const data = await res.json();

      if (data.length > 0) {
        setFeed((prev) => {
          const newPosts = data.filter(
            (post: any) => !prev.some((existing) => existing._id === post._id)
          );
          return [...prev, ...newPosts];
        });
        setSkip((prev) => prev + data.length);
      }

      if (data.length < limit) {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [skip, hasMore]);

  useEffect(() => {
    fetchFeed();
    fetchActivities();
  }, [fetchFeed, fetchActivities]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || isFetching.current || !hasMore) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = window.innerHeight + window.scrollY;

      if (currentHeight >= scrollHeight - 100) {
        fetchFeed();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchFeed, loading, hasMore]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10">
      <div className="max-w-7xl mx-auto flex gap-12">
        
        {/* Left Column: Game Posts */}
        <div className="flex-1 flex flex-wrap gap-6">
          {error && <p className="text-red-500 w-full">{error}</p>}

          {feed.map((post: any) => (
            <FeedPost
              key={post._id}
              title={post.title}
              description={post.description}
              type={post.type}
              feedImage={post.feedImage}
              score={post.score}
              reviewCount={post.reviewCount}
            />
          ))}

          {loading && (
            <p className="text-gray-400 w-full text-center py-10">Loading...</p>
          )}
        </div>

        {/* Right Column: Reviews + Friend Activity */}
        <div className="w-96 flex-shrink-0 flex flex-col gap-4 border-l border-zinc-800/50 pl-8">
          <h2 className="text-left font-bold text-lg mb-4 text-zinc-100">
            Latest Reviews & Activity
          </h2>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
            {activities.length > 0 ? (
              activities.map((act: any) => {
                if (act.type === "REVIEW") {
                  return (
                    <FeedReviewPost
                      key={act._id}
                      user={act.username}
                      game={act.game.title}
                      review={act.rating?.review || ""}
                      score={act.rating?.score || 0}
                    />
                  );
                }
                return (
                  <FeedFriendActivity
                    key={act._id}
                    user={act.username}
                    game={act.game.title}
                  />
                );
              })
            ) : (
              <p className="text-zinc-500 text-sm italic">No recent activity.</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}