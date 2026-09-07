import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../services/api.client.service";
import type { JobApplication } from "../interface/job-application";

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
const PRIVATE_USER_CHANNEL_PREFIX = "private-user-";
const SCREENING_STATUS_UPDATED_EVENT =
  "job-application:screening-status-updated";

interface ScreeningStatusUpdatedPayload {
  message: string;
  updatedJobApplication: JobApplication;
}

const useScreeningStatusUpdates = (
  onScreeningStatusUpdated: (jobApplication: JobApplication) => void,
) => {
  const { user } = useAuth();
  const userId = user?._id;
  const onScreeningStatusUpdatedRef = useRef(onScreeningStatusUpdated);

  useEffect(() => {
    onScreeningStatusUpdatedRef.current = onScreeningStatusUpdated;
  }, [onScreeningStatusUpdated]);

  useEffect(() => {
    if (!userId) return;

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

    const channelName = `${PRIVATE_USER_CHANNEL_PREFIX}${userId}`;
    const channel = pusher.subscribe(channelName);

    const handleScreeningStatusUpdated = (
      payload: ScreeningStatusUpdatedPayload,
    ) => {
      onScreeningStatusUpdatedRef.current(payload.updatedJobApplication);
    };

    channel.bind(
      SCREENING_STATUS_UPDATED_EVENT,
      handleScreeningStatusUpdated,
    );

    return () => {
      channel.unbind(
        SCREENING_STATUS_UPDATED_EVENT,
        handleScreeningStatusUpdated,
      );
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [userId]);
};

export default useScreeningStatusUpdates;
