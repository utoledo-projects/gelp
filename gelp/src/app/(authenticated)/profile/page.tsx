import PublicUserInfo from "@/components/user/PublicUserInfo";
import FollowingList from "@/components/followers/FollowingList";

const profile = async () => {
  return <main className='max-w-7xl mx-auto p-4 w-full flex gap-12'>
    <div>
      <h2 className='text-3xl'>Profile</h2>
      <PublicUserInfo/>
    </div>
    <div>
      <span className='text-3xl'>Following:</span>
      <FollowingList/>
    </div>
  </main>
}

export default profile
