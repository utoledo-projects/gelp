"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {FC, useEffect} from "react";

type RedirectProps = {
  to: string;
  appendRedirect?: boolean;
}

const Redirect: FC<RedirectProps> = ({appendRedirect = false, to}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (appendRedirect) {
      const params = new URLSearchParams(searchParams);
      params.set('redirect', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''));
      router.push(`${to}?${params.toString()}`);
    } else {
      router.push(to);
    }
  }, []);

  return null;
}

export default Redirect;
