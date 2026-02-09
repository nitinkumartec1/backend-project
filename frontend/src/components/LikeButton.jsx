import { useEffect, useState } from "react";
import { toggleVideoLike, getVideoLikes } from "../api/like.api";

export default function LikeButton({ videoId }) {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    getVideoLikes(videoId).then(res =>
      setLikes(res.data.data.totalLikes)
    );
  }, [videoId]);

  const like = async () => {
    await toggleVideoLike(videoId);
    setLikes(likes + 1);
  };

  return (
    <button
      onClick={like}
      className="px-4 py-1 bg-gray-800 text-white rounded"
    >
      👍 {likes}
    </button>
  );
}