import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../api/user.api";
import { toggleSubscription } from "../api/subscription.api";
import { getAllVideos } from "../api/video.api"; // Wait, we need getUserVideos not getAllVideos
// We don't have getUserVideos in video.api.js?
// Checked dashboard.routes.js: getChannelVideos is for logged in user.
// video.routes.js: getAllVideos takes query params? 
// Let's check video.controller.js to see if getAllVideos supports filtering by userId.
import VideoCard from "../components/VideoCard";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    
    // Fetch Profile
    getUserChannelProfile(username)
      .then(res => {
        setProfile(res.data.data);
         // After getting profile, we could fetch their videos. 
         // But the backend doesn't seem to have a explicit public "get videos by user" endpoint 
         // other than getAllVideos with filters or using the aggregation pipeline in getAllVideos?
         // Let's assume getAllVideos might filter by userId if implemented, OR we missed a route.
         // checking tweet.routes.js: getUserTweets exists.
         // checking playlist.routes.js: getUserPlaylists exists.
         // checking video.routes.js: getAllVideos usually supports query params.
      })
      .catch(err => setError("Channel not found"));

  }, [username]);

  const handleSubscribe = async () => {
    if (!profile) return;
    try {
        await toggleSubscription(profile._id);
        setProfile(prev => ({
            ...prev,
            isSubscribed: !prev.isSubscribed,
            subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
        }));
    } catch (error) {
        console.error("Failed to toggle subscription");
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="h-40 md:h-60 w-full bg-gray-200 overflow-hidden relative">
        {profile.coverImage ? (
             <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center -mt-12 md:-mt-16 mb-8 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
            </div>
            
            <div className="mt-4 md:mt-16 md:ml-6 flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                <p className="text-gray-500">@{profile.username}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>{profile.subscribersCount} subscribers</span>
                    <span>{profile.channelsSubscribedToCount} subscribed</span>
                </div>
            </div>

            <div className="mt-4 md:mt-16">
                 <button 
                    onClick={handleSubscribe}
                    className={`px-6 py-2 rounded-full font-medium ${
                        profile.isSubscribed 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                    {profile.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
            </div>
        </div>
        
        {/* We would list videos here, but need to confirm how to fetch them for a specific user.
            Ideally there should be an endpoint like /videos?userId=... 
        */}
        <div className="border-t pt-8">
            <h2 className="text-xl font-bold mb-4">Videos</h2>
            <p className="text-gray-500">Video list to be implemented when API confirms filtering by user.</p>
        </div>
      </div>
    </div>
  );
}
