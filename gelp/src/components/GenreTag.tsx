"use client";

import {FC, useMemo} from "react";
import Link from "next/link";

type GenreTagProps = {
  genre: string;
  link: boolean;
}

const hash = (str: string) => {
  let h = 2;
  for (let i = 0; i < str.length; i++) {
    h *= str.charCodeAt(i) * 25;
    h += str.charCodeAt(i);
    h %= 360;
  }
  return h;
}

const toTitleCase = (str: string) => {
  if (str === 'rpg')
    return 'RPG';
  if (str === 'role-playing (rpg)')
    return 'RPG';
  if (str === 'real time strategy (rts)')
    return 'RTS';
  if (str === 'turn-based strategy (tbs)')
    return 'TBS';

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const GenreTag: FC<GenreTagProps> = ({genre, link}) => {
  const color = useMemo(() => {
    const h = hash(genre);
    return `hsl(${h}, 65%, 45%)`;
  }, [genre]);

  if (!link)
    return <div>
      <button style={{
        backgroundColor: color
      }} className='px-2 py-1 rounded-lg text-shadow-neutral-900 text-shadow-sm' type='button'>
        {toTitleCase(genre)}
      </button>
    </div>

  return <Link href={`/genre/${genre.toLowerCase()}`} className='block transition-all hover:-translate-y-1'>
    <button style={{
      backgroundColor: color
    }} className='px-2 py-1 rounded-lg text-shadow-neutral-900 text-shadow-sm' type='button'>
      {toTitleCase(genre)}
    </button>
  </Link>
}

export default GenreTag;
