import { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.api";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getAllVideos().then(res => setVideos(res.data.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}