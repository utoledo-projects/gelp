import GamesByDeveloper from "@/app/(unauthenticated)/developer/[developer]/GamesByDeveloper";

const DeveloperPage = async ({params}: {params: Promise<{developer: string}>}) => {
  const {developer} = await params;

  return <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
    <div className='max-w-7xl mx-auto flex gap-12'>
      <GamesByDeveloper developer={developer}/>
    </div>
  </main>
}

export default DeveloperPage;
