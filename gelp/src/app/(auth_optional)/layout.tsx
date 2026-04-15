import {FC, PropsWithChildren} from "react";
import {cookies} from "next/headers";
import getUser from "@/actions/getUser";
import UserContext from "@/context/UserContext";
import Redirect from "@/components/util/Redirect";
import Navbar from "@/components/Navbar";

const AuthOptionalLayout: FC<PropsWithChildren> = async ({children}) => {
  const cookieStore = await cookies();
  const authenticatedCookie = cookieStore.get('G_AUTHENTICATED');
  const accessToken = cookieStore.get('G_ACCESS_TOKEN');
  const user = await getUser(accessToken?.value);

  if (authenticatedCookie !== undefined && user === null)
    return <Redirect to={'/auth/refresh'} appendRedirect/>

  return <UserContext value={user ? {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    avatar: user.avatar,
    isAdministrator: user.isAdministrator
  } : null}>
    <Navbar />
    {children}
  </UserContext>
}

export default AuthOptionalLayout;
