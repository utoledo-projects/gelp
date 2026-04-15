import {useEffect, useRef, useState} from "react";

type FollowingUser = {
  _id: string;
  username: string;
  avatar?: string;
}

const useFollowing = () => {
  const [following, setFollowing] = useState<FollowingUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    fetch('/api/user/following')
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
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
  }, []);

  return {following, loading, error};
}

export default useFollowing;