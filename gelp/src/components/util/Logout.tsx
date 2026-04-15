"use client";

import {useCallback, useEffect, useState} from "react";

const Logout = () => {
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
          console.log('logged out');
          window.location.replace('/');
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

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
          Logging out...
        </p>
      </div>
    </div>
  );
}

export default Logout;
