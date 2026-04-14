import GamesByGenre from "@/app/(unauthenticated)/genre/[genreID]/GamesByGenre";

const GenrePage = async ({params}: { params: Promise<{genreID: string }>}) => {
  let {genreID} = await params;
  genreID = decodeURIComponent(genreID);

  return <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
    <div className='max-w-7xl mx-auto flex gap-12'>
      <GamesByGenre genre={genreID}/>
    </div>
  </main>
}

export default GenrePage;
