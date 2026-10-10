import { supabase } from "../../../Supabase";
import type { Channel, Message } from "../types";

/* ---------------------------------------------------------------- */
/*  Каналы                                                          */
/* ---------------------------------------------------------------- */

export async function getChannels(team: string): Promise<Channel[]> {
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .or(`type.in.(general,announcement),team_ids.cs.{${team}}`)
    .order("type", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Channel[];
}

export async function getOrCreateDirect(
  teamA: string,
  teamB: string,
): Promise<Channel> {
  const sorted = [teamA, teamB].sort();

  const { data: existing, error: findError } = await supabase
    .from("channels")
    .select("*")
    .eq("type", "direct")
    .contains("team_ids", sorted)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing as Channel;

  const { data, error } = await supabase
    .from("channels")
    .insert({
      type: "direct",
      name: `${sorted[0]} ↔ ${sorted[1]}`,
      team_ids: sorted,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Channel;
}

/* ---------------------------------------------------------------- */
/*  Сообщения                                                       */
/* ---------------------------------------------------------------- */

type GetMessagesOpts = {
  limit?: number;
  /** ISO-строка: вернуть сообщения старше этого времени (для подгрузки вверх) */
  before?: string;
};

export async function getMessages(
  channelId: string,
  opts: GetMessagesOpts = {},
): Promise<Message[]> {
  const { limit = 50, before } = opts;

  let query = supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt("created_at", before);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as Message[]).reverse();
}

export async function sendMessage(params: {
  channelId: string;
  channelType: string;
  userId: number;
  team: string;
  role: string;
  text: string;
}): Promise<Message> {
  const { channelId, channelType, userId, team, role, text } = params;

  const trimmed = text.trim();
  if (!trimmed) throw new Error("Пустое сообщение");
  if (trimmed.length > 2000) throw new Error("Слишком длинное сообщение");

  if (channelType === "announcement" && role !== "admin") {
    throw new Error("Писать в канал объявлений может только комиссионер");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      channel_id: channelId,
      user_id: userId,
      team,
      text: trimmed,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Пересылка сообщения в другой канал.
 *
 * Вариант A (без дублирования текста):
 *  - Если подписи нет: text = null, forwarded_text = снапшот оригинала.
 *    UI рендерит только forwarded-блок.
 *  - Если подпись есть: text = подпись, forwarded_text = снапшот оригинала.
 *    UI рендерит forwarded-блок + подпись.
 *
 * Правила:
 *  - Нельзя пересылать В канал типа "announcement" (Объявления).
 *    Из него пересылать можно.
 *  - Если оригинал сам был переслан — берём корневые forwarded_*,
 *    чтобы не было цепочки "переслано от X (переслано от Y)".
 *  - Сохраняем forwarded_from_channel_id, чтобы UI мог перейти к оригиналу
 *    (только если исходный канал не "direct").
 */
export async function forwardMessage(params: {
  targetChannelId: string;
  targetChannelType: string;
  sourceMessage: Message;
  userId: number;
  team: string;
  role: string;
  caption?: string;
}): Promise<Message> {
  const {
    targetChannelId,
    targetChannelType,
    sourceMessage,
    userId,
    team,
    role,
    caption,
  } = params;

  if (targetChannelType === "announcement") {
    throw new Error("В канал объявлений нельзя пересылать сообщения");
  }

  const rootText = sourceMessage.forwarded_text ?? sourceMessage.text ?? "";
  const rootAuthorTeam =
    sourceMessage.forwarded_author_team ?? sourceMessage.team;
  const rootMessageId =
    sourceMessage.forwarded_from_message_id ?? sourceMessage.id;
  const rootChannelId =
    sourceMessage.forwarded_from_channel_id ?? sourceMessage.channel_id;

  const trimmedCaption = (caption ?? "").trim();
  if (trimmedCaption.length > 2000)
    throw new Error("Слишком длинное сообщение");

  // без подписи text = null, а не копия rootText
  const finalText: string | null = trimmedCaption || null;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      channel_id: targetChannelId,
      user_id: userId,
      team,
      text: finalText,
      forwarded_from_message_id: rootMessageId,
      forwarded_from_channel_id: rootChannelId,
      forwarded_author_team: rootAuthorTeam,
      forwarded_text: rootText,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/* ---------------------------------------------------------------- */
/*  Редактирование / удаление                                       */
/* ---------------------------------------------------------------- */

/**
 * Редактирование сообщения (soft-edit: перезаписываем text + edited_at).
 *
 * Правила:
 *  - Пустой текст нельзя.
 *  - Максимум 2000 символов.
 *  - Редактировать может ТОЛЬКО автор сообщения (роль admin не даёт
 *    прав на чужие сообщения).
 *  - Удалённое сообщение редактировать нельзя.
 *  - Пересланное сообщение (у которого есть forwarded_text) редактировать
 *    нельзя — иначе поедет снапшот оригинала.
 */
export async function editMessage(params: {
  messageId: string;
  userId: number;
  role: string;
  text: string;
}): Promise<Message> {
  const { messageId, userId, text } = params;

  const trimmed = text.trim();
  if (!trimmed) throw new Error("Пустое сообщение");
  if (trimmed.length > 2000) throw new Error("Слишком длинное сообщение");

  const { data: existing, error: findError } = await supabase
    .from("messages")
    .select("user_id, deleted_at, forwarded_text")
    .eq("id", messageId)
    .single();

  if (findError) throw findError;
  if (existing.deleted_at) throw new Error("Сообщение удалено");
  if (existing.forwarded_text) {
    throw new Error("Пересланное сообщение нельзя редактировать");
  }
  if (existing.user_id !== userId) {
    throw new Error("Можно редактировать только свои сообщения");
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ text: trimmed, edited_at: new Date().toISOString() })
    .eq("id", messageId)
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Удаление сообщения (soft-delete: ставим deleted_at, text оставляем).
 *
 * UI рендерит "Сообщение удалено" и не даёт действий.
 *
 * Правила:
 *  - Удалять может ТОЛЬКО автор сообщения (роль admin не даёт
 *    прав на чужие сообщения).
 *  - Повторное удаление — no-op, возвращает текущую запись.
 */
export async function deleteMessage(params: {
  messageId: string;
  userId: number;
  role: string;
}): Promise<Message> {
  const { messageId, userId } = params;

  const { data: existing, error: findError } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (findError) throw findError;
  if (existing.deleted_at) return existing as Message;
  if (existing.user_id !== userId) {
    throw new Error("Можно удалять только свои сообщения");
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", messageId)
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/* ---------------------------------------------------------------- */
/*  Поиск                                                           */
/* ---------------------------------------------------------------- */

/**
 * Серверный поиск по текущему каналу.
 * Ищет по text и forwarded_text, регистронезависимо (ilike).
 * Удалённые сообщения исключаются.
 *
 * Для MVP можно и не использовать — в ChannelView достаточно локального
 * фильтра по уже загруженным messages. Функция пригодится, когда нужно
 * искать по всей истории канала, а не только по последним 50.
 */
export async function searchMessages(params: {
  channelId: string;
  query: string;
  limit?: number;
}): Promise<Message[]> {
  const { channelId, query, limit = 100 } = params;
  const q = query.trim();
  if (!q) return [];

  // Экранируем спецсимволы LIKE, чтобы % и _ не ломали поиск
  const escaped = q.replace(/[%_]/g, (m) => `\\${m}`);

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .is("deleted_at", null)
    .or(`text.ilike.%${escaped}%,forwarded_text.ilike.%${escaped}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Message[];
}

/* ---------------------------------------------------------------- */
/*  Realtime по сообщениям                                          */
/* ---------------------------------------------------------------- */

/**
 * Подписка на изменения сообщений в канале.
 *
 * Для DELETE важно, чтобы в Supabase у таблицы messages было
 * `replica identity full`, иначе payload.old придёт без id.
 */
export function subscribeToMessages(
  channelId: string,
  handlers: {
    onInsert: (msg: Message) => void;
    onUpdate: (msg: Message) => void;
    onDelete: (id: string) => void;
  },
): () => void {
  const sub = supabase
    .channel(`room:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => handlers.onInsert(payload.new as Message),
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => handlers.onUpdate(payload.new as Message),
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => handlers.onDelete((payload.old as { id: string }).id),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(sub);
  };
}

/* ---------------------------------------------------------------- */
/*  Непрочитанные                                                   */
/* ---------------------------------------------------------------- */

export async function markChannelRead(
  userId: number,
  channelId: string,
): Promise<void> {
  const { error } = await supabase.from("channel_reads").upsert(
    {
      user_id: userId,
      channel_id: channelId,
      last_read_at: new Date().toISOString(),
    },
    { onConflict: "user_id,channel_id" },
  );

  if (error) throw error;
}

export async function getUnreadCounts(
  userId: number,
  channelIds: string[],
): Promise<Record<string, number>> {
  if (channelIds.length === 0) return {};

  const counts: Record<string, number> = {};
  channelIds.forEach((id) => (counts[id] = 0));

  const { data: reads, error: readsError } = await supabase
    .from("channel_reads")
    .select("channel_id, last_read_at")
    .eq("user_id", userId)
    .in("channel_id", channelIds);

  if (readsError) throw readsError;

  const readMap = new Map<string, string>();
  (reads ?? []).forEach((r) =>
    readMap.set(r.channel_id as string, r.last_read_at as string),
  );

  const readTimestamps = Array.from(readMap.values()).map((v) =>
    new Date(v).getTime(),
  );
  const earliest =
    readTimestamps.length > 0 ? Math.min(...readTimestamps) : null;

  let msgsQuery = supabase
    .from("messages")
    .select("channel_id, created_at, user_id")
    .in("channel_id", channelIds);

  if (earliest !== null) {
    msgsQuery = msgsQuery.gt("created_at", new Date(earliest).toISOString());
  }

  const { data: msgs, error: msgsError } = await msgsQuery;
  if (msgsError) throw msgsError;

  (msgs ?? []).forEach((m) => {
    if (m.user_id === userId) return;
    const lastRead = readMap.get(m.channel_id as string);
    if (!lastRead || new Date(m.created_at as string) > new Date(lastRead)) {
      counts[m.channel_id as string] =
        (counts[m.channel_id as string] ?? 0) + 1;
    }
  });

  return counts;
}

export function subscribeToAllMessages(
  onNew: (msg: Message) => void,
): () => void {
  const sub = supabase
    .channel("messages-unread")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => onNew(payload.new as Message),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(sub);
  };
}

/* ---------------------------------------------------------------- */
/*  Прочтения (галочки)                                             */
/* ---------------------------------------------------------------- */

export type ChannelRead = {
  user_id: number;
  last_read_at: string;
};

export async function getChannelReads(
  channelId: string,
): Promise<ChannelRead[]> {
  const { data, error } = await supabase
    .from("channel_reads")
    .select("user_id, last_read_at")
    .eq("channel_id", channelId);

  if (error) throw error;
  return (data ?? []) as ChannelRead[];
}

export function subscribeToChannelReads(
  channelId: string,
  onChange: () => void,
): () => void {
  const sub = supabase
    .channel(`reads:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "channel_reads",
        filter: `channel_id=eq.${channelId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(sub);
  };
}
