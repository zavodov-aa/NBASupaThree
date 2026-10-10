import { useCallback, useEffect, useRef, useState } from "react";
import {
  getUnreadCounts,
  markChannelRead,
  subscribeToAllMessages,
} from "../api/chat";

export function useUnreadCounts(
  userId: number | undefined,
  channelIds: string[],
  activeChannelId: string | null,
) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  // стабильный ключ, чтобы не пересоздавать refresh на каждый рендер
  const idsKey = channelIds.slice().sort().join(",");

  // актуальные значения держим в ref, чтобы не рвать realtime-подписку
  const channelIdsRef = useRef(channelIds);
  const activeRef = useRef(activeChannelId);

  useEffect(() => {
    channelIdsRef.current = channelIds;
  }, [idsKey]);

  useEffect(() => {
    activeRef.current = activeChannelId;
  }, [activeChannelId]);

  // дебаунс отметки "прочитано" — не чаще раза в 2 секунды на канал
  const markTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const scheduleMarkRead = useCallback(
    (channelId: string) => {
      if (!userId) return;
      const existing = markTimers.current[channelId];
      if (existing) clearTimeout(existing);
      markTimers.current[channelId] = setTimeout(() => {
        delete markTimers.current[channelId];
        markChannelRead(userId, channelId).catch((e) =>
          console.error("mark read failed", e),
        );
      }, 2000);
    },
    [userId],
  );

  // очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      Object.values(markTimers.current).forEach(clearTimeout);
      markTimers.current = {};
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!userId || channelIds.length === 0) return;
    try {
      const result = await getUnreadCounts(userId, channelIds);
      setCounts(result);
    } catch (e) {
      console.error("unread counts failed", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, idsKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime — одна подписка на все сообщения.
  // activeChannelId в deps НЕ кладём: он читается через ref.
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToAllMessages((msg) => {
      if (msg.user_id === userId) return; // свои не считаем
      if (!channelIdsRef.current.includes(msg.channel_id)) return;

      // если открыт этот канал — просто расписание на markRead, без записи на каждое сообщение
      if (msg.channel_id === activeRef.current) {
        scheduleMarkRead(msg.channel_id);
        return;
      }

      setCounts((prev) => ({
        ...prev,
        [msg.channel_id]: (prev[msg.channel_id] ?? 0) + 1,
      }));
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, idsKey, scheduleMarkRead]);

  // при открытии канала — обнуляем локально + отложенная запись в БД
  useEffect(() => {
    if (!activeChannelId || !userId) return;

    setCounts((prev) => ({ ...prev, [activeChannelId]: 0 }));
    scheduleMarkRead(activeChannelId);
  }, [activeChannelId, userId, scheduleMarkRead]);

  return { counts, refresh };
}
