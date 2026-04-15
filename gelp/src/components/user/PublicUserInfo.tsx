"use client";

import {FC, useState} from "react";
import useUser from "@/hooks/useUser";
import ChangeAvatarModal from "@/components/user/ChangeAvatarModal";
import UserIcon from "@/components/UserIcon";

const PublicUserInfo: FC = () => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const user = useUser();

  if (user === null)
    return null;

  return <>
    <div className='pt-4'>
      <div className='flex flex-col gap-2 items-start'>
        <span className='font-bold'>Avatar:</span>
        <div className='flex gap-4 items-center'>
          <UserIcon user={user} size={48}/>
          <button className='bg-blue-700 hover:bg-blue-800 p-2 rounded-xl' onClick={() => setShowAvatarModal(true)}>Change
            Avatar
          </button>
        </div>

        <label htmlFor='username' className='font-bold'>Username:</label>
        <input id='username' value={user.username} disabled readOnly className='bg-zinc-900 p-2 rounded-xl w-75'/>

        <label htmlFor='email' className='font-bold'>Email:</label>
        <input id='email' value={user.email} disabled readOnly className='bg-zinc-900 p-2 rounded-xl w-75'/>
        {user.emailVerified && <span className='pl-2 text-green-500'>Verified.</span>}
        {!user.emailVerified && <span className='pl-2 text-red-500'>Not Verified.</span>}


      </div>
    </div>
    <ChangeAvatarModal show={showAvatarModal} close={() => setShowAvatarModal(false)}/>
  </>
}

export default PublicUserInfo;
