import FeedPost from "@/components/feed/FeedPost";
import FeedReviewPost from "@/components/feed/FeedReviewPost";
import FeedFriendActivity from "@/components/feed/FeedFriendActivity";

export default function SimpleDevPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10">
      <div className="max-w-7xl mx-auto flex gap-12">

        {/* Left Column: Game Posts */}
        <div className="flex-1 flex flex-wrap gap-6">
          <FeedPost
            title="Counter-Strike 2"
            description="The next installment in the world's premier tactical FPS."
            price={0}
            concurrentPlayers={1052972}
            type="update"
            feedImage="https://images.igdb.com/igdb/image/upload/t_cover_big/coaczd.webp"
          />

          <FeedPost
            title="Nine Sols"
            description="A journey through a Taopunk world."
            price={14.99}
            concurrentPlayers={12500}
            type="recommendation"
            feedImage="https://images.igdb.com/igdb/image/upload/t_cover_big/co4l2s.webp"
          />

          <FeedPost
            title="Silksong"
            description="The long-awaited sequel to Hollow Knight."
            price={34.99}
            concurrentPlayers={50000}
            type="release"
            feedImage="https://images.igdb.com/igdb/image/upload/t_cover_big/cobebu.webp"
          />

          <FeedPost
            title="Cyberpunk 2077"
            description="Explore Night City in this open-world RPG."
            price={29.99}
            concurrentPlayers={84200}
            type="sale"
            feedImage="https://images.igdb.com/igdb/image/upload/t_cover_big/coaih8.webp"
          />
        </div>

        {/* Right Column: Reviews + Friend Activity */}
        <div className="w-90 flex-shrink-0 flex flex-col gap-4 border-l border-gray-700 pl-8">          
          <h2 className="text-left font-bold text-lg mb-4">Latest Reviews & Activity</h2>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] pr-2">
            <FeedReviewPost
              user="GamerPro99"
              game="Elden Ring"
              review="Too hard, but I can't stop playing. The world design is incredible."
              rating={4}
              userImage="https://i.pravatar.cc/100?img=9"
            />

            <FeedFriendActivity
              user="Jake"
              action="started playing"
              game="Helldivers 2"
              userImage="https://i.pravatar.cc/100?img=12"
              time="2 hours ago"
            />
          </div>
        </div>

      </div>
    </main>
  );
}