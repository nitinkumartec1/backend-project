import { useEffect, useState } from "react";
import { getSubscribedChannels } from "../api/subscription.api";
import { getCurrentUser } from "../api/auth.api";
import { Link } from "react-router-dom";

export default function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        const userId = res.data.data._id;
        return getSubscribedChannels(userId);
      })
      .then(res => {
        setChannels(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch subscriptions", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-8">Loading subscriptions...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
      {channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {channels.map(channel => (
             <Link key={channel.subscribedChannel._id} to={`/c/${channel.subscribedChannel.username}`} className="block">
                <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                    <img src={channel.subscribedChannel.avatar} alt={channel.subscribedChannel.username} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                    <h3 className="text-center font-bold text-lg">{channel.subscribedChannel.fullName}</h3>
                    <p className="text-center text-gray-500">@{channel.subscribedChannel.username}</p>
                </div>
             </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">You are not subscribed to any channels.</div>
      )}
    </div>
  );
}
