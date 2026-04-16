import GamesByGenre from "@/app/(auth_optional)/genre/[genreID]/GamesByGenre";

const hash = (str: string) => {
  let h = 2;
  for (let i = 0; i < str.length; i++) {
    h *= str.charCodeAt(i) * 25;
    h += str.charCodeAt(i);
    h %= 360;
  }
  return h;
};

const toTitleCase = (str: string) => {
  if (str === "rpg") return "RPG";
  if (str === "role-playing (rpg)") return "RPG";
  if (str === "real time strategy (rts)") return "RTS";
  if (str === "turn-based strategy (tbs)") return "TBS";

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const GenrePage = async ({params}: { params: Promise<{genreID: string }>}) => {
  let {genreID} = await params;
  genreID = decodeURIComponent(genreID);
  
  const color = `hsl(${hash(genreID)}, 65%, 45%)`;

  return <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
    <div className='max-w-7xl mx-auto flex gap-12'>
      <div className="flex flex-col gap-6">
        <h1 className="text-5xl font-extrabold tracking-tight" style={{ color }}>
          {toTitleCase(genreID)}
        </h1>

        <GamesByGenre genre={genreID}/>
      </div>      
    </div>
  </main>
}

export default GenrePage;
