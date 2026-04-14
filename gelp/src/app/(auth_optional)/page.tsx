import FriendActivity from "@/app/(auth_optional)/home/FriendActivity";
import GlobalActivity from "@/app/(auth_optional)/home/GlobalActivity";
import {FC} from "react";

const HomePage: FC = () => {
  return (
    <main className="h-screen bg-black text-white selection:bg-indigo-500/30">
      <div className="h-full max-w-7xl mx-auto flex gap-2">
        <GlobalActivity/>
        <FriendActivity/>
      </div>
    </main>
  );
}

export default HomePage;
