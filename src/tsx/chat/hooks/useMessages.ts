import { useEffect, useState, useCallback, useRef } from "react";
import { getMessages, subscribeToMessages } from "../api/chat";
import type { Message } from "../types";

const MAX_MESSAGES = 500;

export function useMessages(channelId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  // защита от гонок: если пользователь быстро переключает каналы,
  // ответы старого канала не должны перезаписать новый
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!channelId) return;
    const reqId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setMessages([]);
    setHasMore(false);

    try {
      const data = await getMessages(channelId, { limit: 50 });

      // если за время запроса канал сменился — игнорируем ответ
      if (reqId !== requestIdRef.current) return;

      setMessages(data);
      // если пришло ровно limit — вероятно, есть ещё
      setHasMore(data.length === 50);
    } catch (e) {
      if (reqId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : "Ошибка загрузки сообщений");
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, [channelId]);

  // подгрузка старых сообщений вверх
  const loadMore = useCallback(async () => {
    if (!channelId || loadingMore || !hasMore) return;
    const oldest = messages[0];
    if (!oldest) return;

    const reqId = requestIdRef.current;
    setLoadingMore(true);
    try {
      const older = await getMessages(channelId, {
        limit: 50,
        before: oldest.created_at,
      });
      if (reqId !== requestIdRef.current) return;
      // старые кладём в начало, дубли отсекаем
      setMessages((prev) => {
        const known = new Set(prev.map((m) => m.id));
        const fresh = older.filter((m) => !known.has(m.id));
        return [...fresh, ...prev];
      });
      setHasMore(older.length === 50);
    } catch (e) {
      console.error("loadMore failed", e);
    } finally {
      if (reqId === requestIdRef.current) setLoadingMore(false);
    }
  }, [channelId, messages, loadingMore, hasMore]);

  // При смене канала: перезагружаем + переподписываемся
  useEffect(() => {
    if (!channelId) return;

    load();

    unsubscribeRef.current = subscribeToMessages(channelId, {
      onInsert: (msg) => {
        setMessages((prev) => {
          // защита от дубля: если сообщение уже есть (например, свой optimistic insert), пропускаем
          if (prev.some((m) => m.id === msg.id)) return prev;
          const next = [...prev, msg];
          // не даём массиву расти бесконечно
          return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
        });
      },
      onUpdate: (msg) => {
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
      },
      onDelete: (id) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      },
    });

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [channelId, load]);

  /**
   * Добавить сообщение локально (для оптимистичного UI).
   */
  const appendLocal = useCallback((msg: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      const next = [...prev, msg];
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
    });
  }, []);

  /**
   * Обновить сообщение локально (после edit или soft-delete).
   * Используется в ChannelView, чтобы не ждать realtime-эха.
   */
  const applyUpdate = useCallback((msg: Message) => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
  }, []);

  /**
   * Удалить сообщение локально (для hard-delete).
   * При soft-delete хватает applyUpdate.
   */
  const applyDelete = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    messages,
    loading,
    error,
    hasMore,
    loadingMore,
    reload: load,
    loadMore,
    appendLocal,
    applyUpdate,
    applyDelete,
  };
}
