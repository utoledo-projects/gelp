import {FC, PropsWithChildren} from "react";
import getUser from "@/actions/getUser";
import Redirect from "@/components/util/Redirect";
import {cookies} from "next/headers";
import UserContext from "@/context/UserContext";
import Navbar from "@/components/Navbar";

const AuthenticatedLayout: FC<PropsWithChildren> = async ({children}) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('G_ACCESS_TOKEN');

  const user = await getUser(accessToken?.value);

  if (user === null)
    return <Redirect to={'/auth/refresh'} appendRedirect />

  return <UserContext value={{
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    avatar: user.avatar,
    following: user.following,
    library: user.library,
    isAdministrator: user.isAdministrator
  }}>
    <Navbar />
    {children}
  </UserContext>
}

export default AuthenticatedLayout;
