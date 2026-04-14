"use client";

import useUser from "@/hooks/useUser";
import {useCallback, useRef, useState} from "react";
import FeedReviewPost from "@/components/feed/FeedReviewPost";
import FeedFriendActivity from "@/components/feed/FeedFriendActivity";
import {IUserActivity} from "@/db";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Link from "next/link";

const FETCH_LIMIT = 100;

const FriendActivity = () => {
  const user = useUser();
  const [activities, setActivities] = useState<(IUserActivity & {_id: string})[] | null>(null);
  const [skip, setSkip] = useState(0);
  const moreRef = useRef(true);

  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchActivities = useCallback(async () => {
    if (loadingRef.current || !moreRef) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/useractivity?skip=${skip}&limit=${FETCH_LIMIT}`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data = await res.json();

      if (data.activities.length > 0) {
        setActivities((prev) => {
          const newPosts = data.activities.filter(
            (post: IUserActivity & {_id: string}) => !(prev ?? []).some((existing) => existing._id === post._id)
          );

          return [...(prev ?? []), ...newPosts];
        });
        setSkip((prev) => prev + data.activities.length);
      }

      if (data.activities.length < FETCH_LIMIT) {
        moreRef.current = false;
      }
    } catch (err: any) {
      setError('message' in err ? err.message : 'An unknown error occurred.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useInfiniteScroll(
    wrapperRef,
    bottomRef,
    loadingRef,
    fetchActivities,
    user !== null
  );

  if (user === null)
    return <div className="w-96 shrink-0 flex flex-col gap-4 border-l border-zinc-800/50 p-6">
      <h2 className="text-left font-bold text-lg mb-4 text-zinc-100">
        Latest Reviews & Activity
      </h2>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
        <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-xl p-8 text-center mt-2 transition-colors hover:bg-zinc-900/60">
          <p className="text-zinc-400 text-sm mb-3">
            See the games your friends are adding
          </p>
          <Link
            href="/auth/login"
            className="text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors"
          >
            Sign in to view activity
          </Link>
        </div>
      </div>
    </div>

  if (error !== null) {
    return <div className="w-96 shrink-0 flex flex-col gap-4 border-l border-zinc-800/50 pl-8">
      <h2 className="text-left font-bold text-lg mb-4 text-zinc-100">
        Latest Reviews & Activity
      </h2>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
        <p className='text-zinc-500 text-sm italic'>{error}</p>
      </div>
    </div>
  }

  return <div ref={wrapperRef} className="w-96 shrink-0 flex flex-col gap-4 border-l border-zinc-800/50 p-6 h-full">
    <h2 className="text-left font-bold text-lg mb-4 text-zinc-100">
      Latest Reviews & Activity
    </h2>

    <div className="flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
      {activities !== null && activities.length > 0 ? (
        <>
          {activities.map((act: any) => {
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
            if (act.type === "ADD_TO_LIBRARY" && user !== null) {
              return (
                <FeedFriendActivity
                  key={act._id}
                  user={act.username}
                  game={act.game.title}
                />
              );
            }
            return null;
          })}
        </>
      ) : (
        <p className="text-zinc-500 text-sm italic">{loading ? 'Loading...' : 'No recent activity.'}</p>
      )}
    </div>
    <div ref={bottomRef} className='min-h-1'/>
  </div>
}

export default FriendActivity;
