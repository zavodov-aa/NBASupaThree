import { useEffect, useState, useCallback, useRef } from "react";
import { getChannels } from "../api/chat";
import type { Channel } from "../types";

export function useChannels(team: string | undefined) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // защита от гонок: если team быстро сменился, ответ старого запроса игнорируем
  const requestIdRef = useRef(0);

  const reload = useCallback(async (): Promise<void> => {
    if (!team) return;
    const reqId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    try {
      const data = await getChannels(team);
      if (reqId !== requestIdRef.current) return; // устаревший ответ
      setChannels(data);
    } catch (e) {
      if (reqId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : "Ошибка загрузки каналов");
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { channels, loading, error, reload };
}
