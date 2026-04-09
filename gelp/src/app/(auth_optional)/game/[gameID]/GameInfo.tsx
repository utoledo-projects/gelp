import GenreTag from "@/components/GenreTag";
import {FC} from "react";
import {IGame} from "@/db";

type GameInfoProps = {
  game: IGame;
}

const GameInfo: FC<GameInfoProps> = ({game}) => {
  return <div className='flex-1 flex flex-col gap-2'>
    <h1 className='text-3xl lg:text-4xl'>{game.title}</h1>
    <br/>
    <div><span className='font-bold'>Developer:</span> {game.developer}</div>
    <div><span className='font-bold'>Release Date:</span> {game.releaseDate.toISOString().substring(0, 10)}</div>
    <div><span className='font-bold'>Genres:</span></div>
    <div className='flex flex-wrap gap-2'>
      {game.genre.map((genre) => (
        <GenreTag genre={genre} key={genre}/>
      ))}
    </div>
  </div>;
}

export default GameInfo;
