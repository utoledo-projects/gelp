"use client";

import {FC, useCallback, useEffect, useRef, useState} from "react";

type FollowButtonProps = {
  userID: string;
}

const FollowButton: FC<FollowButtonProps> = ({userID}) => {
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    fetch(`/api/user/following/${userID}`)
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 200) {
          setFollowing(json.following);
        } else {
          setError(json.error ?? 'An error occurred.');
        }
      })
      .catch((e) => {
        console.error(e);
        setError('An error occurred.');
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      })
  }, [userID]);

  const click = useCallback(() => {
    if (loadingRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    fetch(`/api/user/following/${userID}`, {
      method: following ? 'DELETE' : 'POST'
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 200) {
          setFollowing(!following);
        } else {
          setError(json.error ?? 'An error occurred.');
        }
      })
      .catch((e) => {
        console.error(e);
        setError('An error occurred.');
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
  }, [following, userID]);

  const text = following ? 'Unfollow' : 'Follow';

  if (error)
    return <button disabled className='bg-red-500 px-3 py-2 rounded-xl font-bold'>{error}</button>

  return <button className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-3 py-2 rounded-xl cursor-pointer disabled:cursor-default' disabled={loading} onClick={click}>{text}</button>
}

export default FollowButton;