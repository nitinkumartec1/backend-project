import { useEffect, useState } from "react";
import { getLikedVideos } from "../api/like.api";
import VideoCard from "../components/VideoCard";

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedVideos()
      .then(res => {
        setVideos(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch liked videos", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-8">Loading liked videos...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No liked videos found.</div>
      )}
    </div>
  );
}
