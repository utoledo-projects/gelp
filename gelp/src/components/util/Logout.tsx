"use client";

import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";

const Logout = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const logout = useCallback(() => {
    return fetch('/api/auth/logout', {
      method: 'DELETE',
      credentials: 'include'
    });
  }, []);

  useEffect(() => {
    logout()
      .then(async (res) => {
        if (res.status === 200) {
          router.replace('/');
        } else {
          const json = await res.json();
          if (json.error) {
            setError(json.error);
          } else {
            setError('An unknown error occurred.');
          }
        }
      })
      .catch(() => {
        setError('An unknown error occurred.');
      })
  }, []);

  if (error.length > 0) return <p>
    {error}
  </p>

  return null;
}

export default Logout;
