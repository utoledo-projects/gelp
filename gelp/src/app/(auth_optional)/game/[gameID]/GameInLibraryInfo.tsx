"use client";

import {FC} from "react";
import useUser from "@/hooks/useUser";
import Link from "next/link";

const GameInLibraryInfo: FC = () => {
  const user = useUser();

  return <div className='flex flex-col gap-4'>
    <h1 className='text-3xl'>Library</h1>
    {user === null && <>
      <p><Link href='/auth/login'>Sign in</Link> to add this game to your library.</p>
    </>}
    {user !== null && <>
      <p>This game is not in your library</p>
      <button className='bg-blue-600 rounded-lg py-1 px-2'>Add it now!</button>
    </>}
  </div>;
}

export default GameInLibraryInfo;
