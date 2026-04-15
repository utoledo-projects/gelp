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
    console.log('mounted');
    refresh()
      .then(res => {
        if (res.status === 200) {
          if (params.has(`redirect ${params.get('redirect')}`)) {
            console.log('redirecting...');
            router.replace(params.get('redirect')!);
          } else {
            console.log('redirecting home...');
            router.replace('/');
          }
        } else {
          console.log('redirecting login');
          router.replace(`/auth/login?${params.toString()}`);
        }
      })
      .catch(() => {
        console.log('redirecting login');
        router.replace(`/auth/login?${params.toString()}`);
      });
  }, [refresh]);

  return null;
}

export default RefreshToken;
