"use client";

import FeedPost from "@/components/feed/FeedPost";
import {useCallback, useRef, useState} from "react";
import {IContentFeed} from "@/db";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const FETCH_LIMIT = 100;

const GlobalActivity = () => {
  const [feed, setFeed] = useState<(IContentFeed & {_id: string})[] | null>(null);
  const [skip, setSkip] = useState(0);

  const moreRef = useRef(true);

  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchFeed = useCallback(async () => {
    if (loadingRef.current || !moreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/contentfeed?skip=${skip}&limit=${FETCH_LIMIT}`);
      if (!res.ok) throw new Error("Failed to fetch feed");

      const data = await res.json();

      if (data.length > 0) {
        setFeed((prev) => {
          const newPosts = data.filter(
            (post: any) => !(prev ?? []).some((existing) => existing._id === post._id)
          );
          return [...(prev ?? []), ...newPosts];
        });
        setSkip((prev) => prev + data.length);
      }

      if (data.length < FETCH_LIMIT) {
        moreRef.current = false;
      }
    } catch (err: any) {
      setError('message' in err ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [skip]);

  useInfiniteScroll(
    wrapperRef,
    bottomRef,
    loadingRef,
    fetchFeed,
    !loadingRef.current
  );

  return <div ref={wrapperRef} className="flex-1 flex flex-wrap gap-6 h-full overflow-y-auto p-6">
    {error && <p className="text-red-500 w-full">{error}</p>}

    {feed !== null && feed.map((post: any) => (
      <FeedPost
        key={post._id}
        id={post.game}
        title={post.title}
        summary={post.summary}
        type={post.type}
        feedImage={post.feedImage}
        score={post.score}
        reviewCount={post.reviewCount}
      />
    ))}

    {loading && (
      <p className="text-gray-400 w-full text-center py-10">Loading...</p>
    )}
    <div ref={bottomRef} className='min-h-1 min-w-1'/>
  </div>
}

export default GlobalActivity;
