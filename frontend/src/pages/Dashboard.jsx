import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboard.api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data.data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-900 text-white p-4 rounded">
        Videos: {stats.totalVideos}
      </div>
      <div className="bg-gray-900 text-white p-4 rounded">
        Views: {stats.totalViews}
      </div>
      <div className="bg-gray-900 text-white p-4 rounded">
        Subscribers: {stats.totalSubscribers}
      </div>
    </div>
  );
}