"use client";

import {createContext} from "react";
import {IUser} from "@/db";

const UserContext = createContext<Omit<IUser, 'password'> & {_id: string} | null>(null);

export default UserContext;
