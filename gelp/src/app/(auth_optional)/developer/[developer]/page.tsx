import GamesByDeveloper from "@/app/(auth_optional)/developer/[developer]/GamesByDeveloper";

const DeveloperPage = async ({params}: {params: Promise<{developer: string}>}) => {
  let {developer} = await params;
  developer = decodeURIComponent(developer);

  return <main className='flex-1 bg-black text-white selection:bg-indigo-500/30 p-10 min-h-0'>
    <div className='max-w-7xl mx-auto flex gap-12 h-full'>
      <GamesByDeveloper developer={developer}/>
    </div>
  </main>
}

export default DeveloperPage;
