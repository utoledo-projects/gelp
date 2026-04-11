import FriendActivity from "@/app/(auth_optional)/home/FriendActivity";
import GlobalActivity from "@/app/(auth_optional)/home/GlobalActivity";
import {FC} from "react";

const HomePage: FC = () => {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10">
      <div className="max-w-7xl mx-auto flex gap-12">
        <GlobalActivity/>
        <FriendActivity/>
      </div>
    </main>
  );
}

export default HomePage;
