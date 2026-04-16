"use client";

import {useCallback, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

const RefreshToken = () => {
  const router = useRouter();
  const params = useSearchParams();

  const refresh = useCallback(() => {
    return fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
  }, []);

  useEffect(() => {
    refresh()
      .then(res => {
        if (res.status === 200) {
          if (params.has(`redirect ${params.get('redirect')}`)) {
            router.replace(params.get('redirect')!);
          } else {
            router.replace('/');
          }
        } else {
          router.replace(`/auth/login?${params.toString()}`);
        }
      })
      .catch(() => {
        router.replace(`/auth/login?${params.toString()}`);
      });
  }, [refresh]);

  return <p>Refreshing...</p>;
}

export default RefreshToken;
