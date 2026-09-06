import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../services/api.client.service";

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
const ONLINE_USERS_CHANNEL = "presence-online-users";

const useUserPresence = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      return;
    }

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      channelAuthorization: {
        customHandler: async ({ socketId, channelName }, callback) => {
          try {
            const { data } = await apiClient.post("/presence/auth", {
              socket_id: socketId,
              channel_name: channelName,
            });
            callback(null, data);
          } catch (error) {
            callback(error as Error, null);
          }
        },
      },
    });

    const channel = pusher.subscribe(ONLINE_USERS_CHANNEL);

    const handleSubscriptionSucceeded = () => setIsOnline(true);
    const handleSubscriptionError = () => setIsOnline(false);

    channel.bind(
      "pusher:subscription_succeeded",
      handleSubscriptionSucceeded,
    );
    channel.bind("pusher:subscription_error", handleSubscriptionError);
    pusher.connection.bind("disconnected", handleSubscriptionError);
    pusher.connection.bind("failed", handleSubscriptionError);

    return () => {
      channel.unbind(
        "pusher:subscription_succeeded",
        handleSubscriptionSucceeded,
      );
      channel.unbind("pusher:subscription_error", handleSubscriptionError);
      pusher.connection.unbind("disconnected", handleSubscriptionError);
      pusher.connection.unbind("failed", handleSubscriptionError);
      pusher.unsubscribe(ONLINE_USERS_CHANNEL);
      pusher.disconnect();
      setIsOnline(false);
    };
  }, [userId]);

  return isOnline;
};

export default useUserPresence;
