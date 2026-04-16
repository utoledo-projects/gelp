"use client";

import {createContext} from "react";
import {IUser} from "@/db";

const UserContext = createContext<Omit<IUser, 'password' | 'updatedAt' | 'createdAt' | 'following' | 'library'> & {_id: string, following: string[], library: string[]} | null>(null);

export default UserContext;
