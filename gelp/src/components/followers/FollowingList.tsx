"use client";

import useFollowing from "@/hooks/useFollowing";
import UserIcon from "@/components/UserIcon";
import Link from "next/link";

const FollowingList = () => {
  const {following, loading, error} = useFollowing();

  if (loading)
    return <div>Loading...</div>;

  if (!following || error)
    return <div className='text-red-500'>{error ?? 'An error occurred.'}</div>;

  return <div className='flex flex-col gap-4 p-4'>
    {following.length === 0 && <span className='text-zinc-500'>Not following any users.</span>}
    {following.map((user) => (
      <div key={user._id}>
        <div className='flex gap-2 items-center p-2 w-50 bg-zinc-800 rounded-xl'>
          <Link href={`/user/${user._id}`}><UserIcon user={user} size={48}/></Link>
          <Link href={`/user/${user._id}`} className='font-bold hover:underline'>{user.username}</Link>
        </div>
      </div>
    ))}
  </div>
}

export default FollowingList;