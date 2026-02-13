import { useEffect, useState } from "react";
import { getWatchHistory } from "../api/user.api";
import VideoCard from "../components/VideoCard";

export default function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchHistory()
      .then(res => {
        setVideos(res.data.data); // data is the watchHistory array
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-8">Loading history...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No watch history found.</div>
      )}
    </div>
  );
}
