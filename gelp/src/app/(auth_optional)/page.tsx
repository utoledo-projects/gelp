import FriendActivity from "@/components/activity/FriendActivity";
import GlobalActivity from "@/components/activity/GlobalActivity";
import {FC} from "react";

const HomePage: FC = () => {
  return (
    <main className="flex flex-col flex-1 bg-black text-white selection:bg-indigo-500/30 min-h-0">
      <div className="h-full max-w-7xl mx-auto flex gap-2">
        <GlobalActivity/>
        <FriendActivity/>
      </div>
    </main>
  );
}

export default HomePage;
