import {cookies} from "next/headers";
import getUser from "@/actions/getUser";
import {FC, PropsWithChildren} from "react";
import Redirect from "@/components/util/Redirect";
import Navbar from "@/components/Navbar";
import UserContext from "@/context/UserContext";

const AdminLayout: FC<PropsWithChildren> = async ({children}) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('G_ACCESS_TOKEN');

  const user = await getUser(accessToken?.value);

  if (user === null)
    return <Redirect to={'/auth/refresh'} appendRedirect />

  if (!user.isAdministrator)
    return <Redirect to={'/'}/>

  return <UserContext value={user}>
    <Navbar />
    {children}
  </UserContext>
}

export default AdminLayout;
