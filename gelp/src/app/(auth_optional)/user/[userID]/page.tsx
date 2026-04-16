import UserIcon from "@/components/UserIcon";
import FollowButton from "@/components/followers/FollowButton";
import FollowingGames from "@/components/followers/FollowingGames";

const Page = async ({params}: {params: Promise<{userID: string}>}) => {
  const {userID} = await params;
  const user = await User.findById(userID).exec();

  if (user === null)
    return <div>
      <h1>User not found.</h1>
    </div>

  return <div className='flex flex-col max-w-7xl mx-auto p-4 w-full flex-1 gap-6'>
    <div className='flex justify-between items-center'> {/* User Header */}
      <div className='flex items-center gap-4'>
        <UserIcon user={user} size={48}/>
        <h1 className='font-bold text-2xl'>{user.username}</h1>
      </div>
      <div>
        <FollowButton userID={user._id.toString()}/>
      </div>
    </div>
    <FollowingGames user={{
      _id: user._id.toString(),
      username: user.username
    }}/>
  </div>
}

export default Page;