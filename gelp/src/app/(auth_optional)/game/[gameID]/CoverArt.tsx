import {IGame} from "@/db";
import {FC} from "react";

type CoverArtProps = {
  game: IGame
}

const CoverArt: FC<CoverArtProps> = ({game}) => {
  return <img className='rounded-2xl w-full flex-1' src={game.coverArt} alt={`${game.title} cover`}/>
}

export default CoverArt;
