"use client";

import GameRatingList from "@/app/(auth_optional)/game/[gameID]/GameRatingList";
import GameInLibraryInfo from "@/app/(auth_optional)/game/[gameID]/GameInLibraryInfo";
import GameRatings from "@/app/(auth_optional)/game/[gameID]/GameRatings";
import CoverArt from "@/app/(auth_optional)/game/[gameID]/CoverArt";
import GameInfo from "@/app/(auth_optional)/game/[gameID]/GameInfo";
import {FC, useState} from "react";
import {IGame, IRating} from "@/db";

type PageClientProps = {
  game: IGame & {_id: string},
  ratings: {
    sum: number,
    count: number,
  },
}

const PageClient: FC<PageClientProps> = ({game, ratings}) => {
  const [myRating, setMyRating] = useState<IRating & {_id: string} | null>(null);

  return <>
    <div className='max-w-7xl bg-neutral-900 p-4 flex rounded-4xl mx-auto gap-8'>
      <CoverArt game={game}/>
      <GameInfo game={game}/>
      <div className='flex-1 flex flex-col gap-16'>
        <GameInLibraryInfo/>
        <GameRatings ratings={ratings} game={game} setRating={setMyRating}/>
      </div>
    </div>
    <GameRatingList gameID={game._id} rating={myRating}/>
  </>
}

export default PageClient;
