import PublicUserInfo from "@/components/user/PublicUserInfo";

const profile = async () => {
  return <main className='max-w-7xl mx-auto p-4'>
    <h2 className='text-3xl'>Profile</h2>
    <PublicUserInfo/>
  </main>
}

export default profile
