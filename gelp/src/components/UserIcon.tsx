import {FC} from "react";

type UserIconProps = {
  user: {
    username: string;
    avatar?: string;
  };
  size?: number;
}

const UserIcon: FC<UserIconProps> = ({user, size = 32}) => {
  return <>
    {user.avatar && <div
      style={{width: size, height: size}}
      className='cursor-pointer border border-zinc-700 hover:border-zinc-400 rounded-full transition-all shrink-0'
    >
      <img className='w-full h-full rounded-full' src={user.avatar} alt='user avatar'/>
    </div>}
    {!user.avatar && <div
      style={{width: size, height: size, fontSize: Math.ceil(size / 3)}}
      className='rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all text-zinc-100 font-bold uppercase shrink-0'
    >
      {user.username.charAt(0).toUpperCase()}
    </div>}
  </>
}

export default UserIcon;