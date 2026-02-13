import { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.api";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (query = "") => {
    setLoading(true);
    try {
      const res = await getAllVideos({ query });
      // Controller returns { videos, total, page, ... } in data.data
      setVideos(res.data.data.videos || []); 
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchQuery);
  };

  return (
    <div className="p-4 w-full">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
            <input 
                type="text" 
                placeholder="Search videos..." 
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
                type="submit" 
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
            >
                Search
            </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center mt-10 text-gray-500">Loading videos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.length > 0 ? (
            videos.map(video => (
                <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-10">
                No videos found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}