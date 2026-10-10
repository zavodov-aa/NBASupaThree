import { useCallback, useEffect, useState } from "react";
import {
  getChannelReads,
  subscribeToChannelReads,
  type ChannelRead,
} from "../api/chat";

export function useChannelReads(channelId: string) {
  const [reads, setReads] = useState<ChannelRead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getChannelReads(channelId);
      setReads(data);
    } catch {
      // тихо игнорим — галочки не критичны
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    setLoading(true);
    load();

    const unsub = subscribeToChannelReads(channelId, load);
    return unsub;
  }, [channelId, load]);

  return { reads, loading };
}
