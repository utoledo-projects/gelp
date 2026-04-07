"use client";

import {FC, useMemo} from "react";

type GenreTagProps = {
  genre: string;
}

const hash = (str: string) => {
  let h = 2;
  for (let i = 0; i < str.length; i++) {
    h *= str.charCodeAt(i) * 23;
    h += str.charCodeAt(i);
    h %= 360;
  }
  return h;
}

const GenreTag: FC<GenreTagProps> = ({genre}) => {
  const color = useMemo(() => {
    const h = hash(genre);
    return `hsl(${h}, 65%, 45%)`;
  }, [genre]);

  return <div>
    <button style={{
      backgroundColor: color
    }} className='px-2 py-1 rounded-lg text-shadow-neutral-900 text-shadow-sm' type='button'>
      {genre}
    </button>
  </div>
}

export default GenreTag;
