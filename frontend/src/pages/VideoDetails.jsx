import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";

import LikeButton from "../components/LikeButton";
import SubscribeButton from "../components/SubscribeButton";
import Comments from "../components/Comments";

export default function VideoDetails() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getVideoById(id).then((res) => setVideo(res.data.data));
  }, [id]);

  if (!video)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Section */}
      <div className="lg:col-span-2">
        <video
          src={typeof video.videoFile === 'string' ? video.videoFile : video.videoFile.url}
          controls
          className="w-full h-auto rounded-lg shadow-lg"
          autoPlay
        />

        <h1 className="text-xl font-bold mt-3">
          {video.title}
        </h1>

        <div className="flex items-center gap-4 mt-2">
          <LikeButton videoId={video._id} />
          <SubscribeButton channelId={video.owner._id} />
        </div>

        <p className="mt-3 text-gray-700">
          {video.description}
        </p>

        <Comments videoId={video._id} />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <p className="text-gray-500">More videos coming here...</p>
      </div>
    </div>
  );
}