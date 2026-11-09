import { useCallback, useEffect, useState } from "react";
import { getReactionsForChannel, subscribeToReactions } from "../api/chat";
import type { MessageReaction } from "../types";

export function useReactions(channelId: string) {
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const data = await getReactionsForChannel(channelId);
      setReactions(data);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    setLoading(true);
    reload();

    const unsub = subscribeToReactions(channelId, reload);
    return () => unsub();
  }, [channelId, reload]);

  return { reactions, loading, reload };
}
