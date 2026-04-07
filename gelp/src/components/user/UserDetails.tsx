"use client";

import useUser from "@/hooks/useUser";

const UserDetails = () => {
  const user = useUser();

  if (user === null)
    return null;

  return <div className='p-4'>
    {Object.entries(user).map(([key, value]) => {
      if (value instanceof Date)
        return <p>{key}: {value.toLocaleString()}</p>
      return <p>{key}: {value.toString()}</p>
    })}
  </div>
}

export default UserDetails;
