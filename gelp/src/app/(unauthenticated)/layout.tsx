import {FC, PropsWithChildren} from "react";
import Navbar from "@/components/Navbar";
import {cookies} from "next/headers";
import Redirect from "@/components/util/Redirect";

const UnauthenticatedLayout: FC<PropsWithChildren> = async ({children}) => {
  const cookieStore = await cookies();
  const authenticatedCookie = cookieStore.get('G_AUTHENTICATED');

  if (authenticatedCookie)
    return <Redirect to='/'/>

  return <>
    <Navbar/>
    {children}
  </>
}

export default UnauthenticatedLayout;