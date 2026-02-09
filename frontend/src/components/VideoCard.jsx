import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <Link to={`/video/${video._id}`}>
      <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
        <img src={video.thumbnail} className="w-full h-40 object-cover" />
        <div className="p-2">
          <h3 className="font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-400">
            {video.owner.username}
          </p>
        </div>
      </div>
    </Link>
  );
}