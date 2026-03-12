import {FC, PropsWithChildren} from "react";
import getUser from "@/actions/getUser";
import Redirect from "@/components/util/Redirect";
import {cookies} from "next/headers";

const AuthenticatedLayout: FC<PropsWithChildren> = async ({children}) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('G_ACCESS_TOKEN');

  const user = await getUser(accessToken?.value);

  if (user === null)
    return <Redirect to={'/auth/refresh'} appendRedirect />

  return <>
    {children}
  </>
}

export default AuthenticatedLayout;
