import {FC, PropsWithChildren} from "react";
import Navbar from "@/components/Navbar";

const UnauthenticatedLayout: FC<PropsWithChildren> = ({children}) => {
  return <>
    <Navbar/>
    {children}
  </>
}

export default UnauthenticatedLayout;