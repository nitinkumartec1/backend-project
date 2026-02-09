import { useEffect, useState } from "react";
import {
  toggleSubscription,
  getSubscribers
} from "../api/subscription.api";

export default function SubscribeButton({ channelId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getSubscribers(channelId).then(res =>
      setCount(res.data.data.length)
    );
  }, [channelId]);

  return (
    <button
      onClick={() => toggleSubscription(channelId)}
      className="bg-red-600 text-white px-4 py-1 rounded"
    >
      Subscribe {count}
    </button>
  );
}