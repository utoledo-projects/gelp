"use client";

import {createContext} from "react";
import {IUser} from "@/db";

const UserContext = createContext<Omit<IUser, 'password' | 'updatedAt' | 'createdAt' | 'following'> & {_id: string, following: string[]} | null>(null);

export default UserContext;
