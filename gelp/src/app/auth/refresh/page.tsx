import RefreshToken from "@/components/util/RefreshToken";
import {Suspense} from "react";

const Page = () => {
  return <div>
    <Suspense>
      <RefreshToken/>
    </Suspense>
  </div>
}

export default Page;
