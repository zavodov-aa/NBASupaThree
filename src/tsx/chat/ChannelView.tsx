// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../authorization/AuthContext";
// import { sendMessage, editMessage, deleteMessage } from "./api/chat";
// import { useMessages } from "./hooks/useMessages";
// import { useChannelReads } from "./hooks/useChannelReads";
// import MessageItem from "./MessageItem";
// import MessageInput from "./MessageInput";
// import type { Channel, Message } from "./types";

// type Props = {
//   channel: Channel;
//   channels: Channel[];
//   highlightMessageId: string | null;
//   onForward: (message: Message) => void;
//   onGoToSource: (messageId: string, channelId: string) => void;
// };

// export default function ChannelView({
//   channel,
//   channels,
//   highlightMessageId,
//   onForward,
//   onGoToSource,
// }: Props) {
//   const { user } = useAuth();
//   const { messages, loading, error, applyUpdate } = useMessages(channel.id);
//   const { reads } = useChannelReads(channel.id);

//   // ---------------------------------------------------------------- //
//   //  Поиск                                                           //
//   // ---------------------------------------------------------------- //

//   const [query, setQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [activeResultIdx, setActiveResultIdx] = useState(0);

//   // debounce: не фильтруем на каждый символ
//   useEffect(() => {
//     const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
//     return () => window.clearTimeout(t);
//   }, [query]);

//   // локальный поиск по уже загруженным сообщениям.
//   // удалённые и пустые не показываем.
//   const results = useMemo(() => {
//     if (!debouncedQuery) return [];
//     const q = debouncedQuery.toLowerCase();
//     return messages.filter((m) => {
//       if (m.deleted_at) return false;
//       const inText = m.text?.toLowerCase().includes(q) ?? false;
//       const inForwarded = m.forwarded_text?.toLowerCase().includes(q) ?? false;
//       return inText || inForwarded;
//     });
//   }, [messages, debouncedQuery]);

//   // сбрасываем активный индекс при смене запроса
//   useEffect(() => {
//     setActiveResultIdx(0);
//   }, [debouncedQuery]);

//   // скролл к активному результату
//   useEffect(() => {
//     if (!debouncedQuery || results.length === 0) return;
//     const msg = results[activeResultIdx];
//     if (!msg) return;
//     const el = document.querySelector(`[data-message-id="${msg.id}"]`);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//   }, [activeResultIdx, results, debouncedQuery]);

//   const goPrev = () => {
//     if (results.length === 0) return;
//     setActiveResultIdx((i) => (i - 1 + results.length) % results.length);
//   };
//   const goNext = () => {
//     if (results.length === 0) return;
//     setActiveResultIdx((i) => (i + 1) % results.length);
//   };
//   const closeSearch = () => {
//     setQuery("");
//     setDebouncedQuery("");
//     setActiveResultIdx(0);
//   };

//   // ---------------------------------------------------------------- //
//   //  Прочтения                                                       //
//   // ---------------------------------------------------------------- //

//   const readMap = useMemo(() => {
//     const map = new Map<string, boolean>();

//     const parsed = reads
//       .filter((r) => r.user_id !== user?.id)
//       .map((r) => new Date(r.last_read_at).getTime());

//     if (parsed.length === 0) return map;

//     const latestRead = Math.max(...parsed);

//     for (const msg of messages) {
//       const createdAt = new Date(msg.created_at).getTime();
//       map.set(msg.id, latestRead >= createdAt);
//     }

//     return map;
//   }, [reads, messages, user?.id]);

//   if (!user) return null;

//   const canWrite = channel.type !== "announcement" || user.role === "admin";

//   // ---------------------------------------------------------------- //
//   //  Отправка / редактирование / удаление                            //
//   // ---------------------------------------------------------------- //

//   const handleSend = async (text: string) => {
//     await sendMessage({
//       channelId: channel.id,
//       channelType: channel.type,
//       userId: user.id,
//       team: user.team,
//       role: user.role,
//       text,
//     });
//   };

//   const handleEdit = async (msg: Message, newText: string) => {
//     const updated = await editMessage({
//       messageId: msg.id,
//       userId: user.id,
//       role: user.role,
//       text: newText,
//     });
//     applyUpdate(updated);
//   };

//   const handleDelete = async (msg: Message) => {
//     // window.confirm убран — удаление без дополнительного окна подтверждения
//     const updated = await deleteMessage({
//       messageId: msg.id,
//       userId: user.id,
//       role: user.role,
//     });
//     applyUpdate(updated);
//   };

//   // ---------------------------------------------------------------- //
//   //  Рендер                                                          //
//   // ---------------------------------------------------------------- //

//   return (
//     <div className="chat-view">
//       <header className="chat-view__header">
//         <span className="chat-view__name">{channel.name}</span>
//         {channel.type === "announcement" && !canWrite && (
//           <span className="chat-view__hint">Только для чтения</span>
//         )}

//         <div className="chat-view__search">
//           <input
//             className="chat-view__search-input"
//             type="text"
//             placeholder="Поиск..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//           {debouncedQuery && (
//             <>
//               <span className="chat-view__search-count">
//                 {results.length > 0
//                   ? `${activeResultIdx + 1} / ${results.length}`
//                   : "Ничего не найдено"}
//               </span>
//               <button
//                 className="chat-view__search-btn"
//                 onClick={goPrev}
//                 disabled={results.length === 0}
//                 title="Предыдущее"
//               >
//                 ↑
//               </button>
//               <button
//                 className="chat-view__search-btn"
//                 onClick={goNext}
//                 disabled={results.length === 0}
//                 title="Следующее"
//               >
//                 ↓
//               </button>
//               <button
//                 className="chat-view__search-btn"
//                 onClick={closeSearch}
//                 title="Закрыть"
//               >
//                 ✕
//               </button>
//             </>
//           )}
//         </div>
//       </header>

//       <div className="chat-view__messages">
//         {loading && <div className="chat-view__status">Загрузка...</div>}
//         {error && (
//           <div className="chat-view__status chat-view__status--error">
//             {error}
//           </div>
//         )}
//         {!loading && messages.length === 0 && (
//           <div className="chat-view__status">Сообщений пока нет</div>
//         )}
//         {messages.map((msg, i) => {
//           const prev = messages[i - 1];
//           const showTeam = !prev || prev.team !== msg.team;

//           // показываем дату над первым сообщением дня
//           // (или первым сообщением вообще)
//           const showDate =
//             !prev ||
//             new Date(prev.created_at).toDateString() !==
//               new Date(msg.created_at).toDateString();

//           return (
//             <MessageItem
//               key={msg.id}
//               message={msg}
//               isOwn={msg.user_id === user.id}
//               showTeam={showTeam}
//               showDate={showDate}
//               read={readMap.get(msg.id) ?? false}
//               channels={channels}
//               isHighlighted={msg.id === highlightMessageId}
//               onForward={onForward}
//               onGoToSource={onGoToSource}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           );
//         })}
//       </div>

//       {canWrite ? (
//         <MessageInput
//           onSend={handleSend}
//           placeholder={
//             channel.type === "announcement"
//               ? "Объявление..."
//               : "Написать сообщение..."
//           }
//         />
//       ) : (
//         <div className="chat-view__locked">Отправка недоступна</div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../authorization/AuthContext";
import { sendMessage, editMessage, deleteMessage } from "./api/chat";
import { useMessages } from "./hooks/useMessages";
import { useChannelReads } from "./hooks/useChannelReads";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import type { Channel, Message } from "./types";

type Props = {
  channel: Channel;
  channels: Channel[];
  highlightMessageId: string | null;
  onForward: (message: Message) => void;
  onGoToSource: (messageId: string, channelId: string) => void;
  onOpenSidebar: () => void;
};

export default function ChannelView({
  channel,
  channels,
  highlightMessageId,
  onForward,
  onGoToSource,
  onOpenSidebar,
}: Props) {
  const { user } = useAuth();
  const { messages, loading, error, applyUpdate } = useMessages(channel.id);
  const { reads } = useChannelReads(channel.id);

  // ---------------------------------------------------------------- //
  //  Поиск                                                           //
  // ---------------------------------------------------------------- //

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeResultIdx, setActiveResultIdx] = useState(0);

  // debounce: не фильтруем на каждый символ
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(t);
  }, [query]);

  // локальный поиск по уже загруженным сообщениям.
  // удалённые и пустые не показываем.
  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return messages.filter((m) => {
      if (m.deleted_at) return false;
      const inText = m.text?.toLowerCase().includes(q) ?? false;
      const inForwarded = m.forwarded_text?.toLowerCase().includes(q) ?? false;
      return inText || inForwarded;
    });
  }, [messages, debouncedQuery]);

  // сбрасываем активный индекс при смене запроса
  useEffect(() => {
    setActiveResultIdx(0);
  }, [debouncedQuery]);

  // скролл к активному результату
  useEffect(() => {
    if (!debouncedQuery || results.length === 0) return;
    const msg = results[activeResultIdx];
    if (!msg) return;
    const el = document.querySelector(`[data-message-id="${msg.id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeResultIdx, results, debouncedQuery]);

  const goPrev = () => {
    if (results.length === 0) return;
    setActiveResultIdx((i) => (i - 1 + results.length) % results.length);
  };
  const goNext = () => {
    if (results.length === 0) return;
    setActiveResultIdx((i) => (i + 1) % results.length);
  };
  const closeSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setActiveResultIdx(0);
  };

  // ---------------------------------------------------------------- //
  //  Прочтения                                                       //
  // ---------------------------------------------------------------- //

  const readMap = useMemo(() => {
    const map = new Map<string, boolean>();

    const parsed = reads
      .filter((r) => r.user_id !== user?.id)
      .map((r) => new Date(r.last_read_at).getTime());

    if (parsed.length === 0) return map;

    const latestRead = Math.max(...parsed);

    for (const msg of messages) {
      const createdAt = new Date(msg.created_at).getTime();
      map.set(msg.id, latestRead >= createdAt);
    }

    return map;
  }, [reads, messages, user?.id]);

  if (!user) return null;

  const canWrite = channel.type !== "announcement" || user.role === "admin";

  // ---------------------------------------------------------------- //
  //  Отправка / редактирование / удаление                            //
  // ---------------------------------------------------------------- //

  const handleSend = async (text: string) => {
    await sendMessage({
      channelId: channel.id,
      channelType: channel.type,
      userId: user.id,
      team: user.team,
      role: user.role,
      text,
    });
  };

  const handleEdit = async (msg: Message, newText: string) => {
    const updated = await editMessage({
      messageId: msg.id,
      userId: user.id,
      role: user.role,
      text: newText,
    });
    applyUpdate(updated);
  };

  const handleDelete = async (msg: Message) => {
    // window.confirm убран — удаление без дополнительного окна подтверждения
    const updated = await deleteMessage({
      messageId: msg.id,
      userId: user.id,
      role: user.role,
    });
    applyUpdate(updated);
  };

  // ---------------------------------------------------------------- //
  //  Рендер                                                          //
  // ---------------------------------------------------------------- //

  return (
    <div className="chat-view">
      <header className="chat-view__header">
        <button
          type="button"
          className="chat-view__burger"
          onClick={onOpenSidebar}
          title="Каналы"
          aria-label="Открыть список каналов"
        >
          ☰
        </button>

        <span className="chat-view__name">{channel.name}</span>
        {channel.type === "announcement" && !canWrite && (
          <span className="chat-view__hint">Только для чтения</span>
        )}

        <div className="chat-view__search">
          <input
            className="chat-view__search-input"
            type="text"
            placeholder="Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {debouncedQuery && (
            <>
              <span className="chat-view__search-count">
                {results.length > 0
                  ? `${activeResultIdx + 1} / ${results.length}`
                  : "Ничего не найдено"}
              </span>
              <button
                className="chat-view__search-btn"
                onClick={goPrev}
                disabled={results.length === 0}
                title="Предыдущее"
              >
                ↑
              </button>
              <button
                className="chat-view__search-btn"
                onClick={goNext}
                disabled={results.length === 0}
                title="Следующее"
              >
                ↓
              </button>
              <button
                className="chat-view__search-btn"
                onClick={closeSearch}
                title="Закрыть"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </header>

      <div className="chat-view__messages">
        {loading && <div className="chat-view__status">Загрузка...</div>}
        {error && (
          <div className="chat-view__status chat-view__status--error">
            {error}
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="chat-view__status">Сообщений пока нет</div>
        )}
        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const showTeam = !prev || prev.team !== msg.team;

          // показываем дату над первым сообщением дня
          // (или первым сообщением вообще)
          const showDate =
            !prev ||
            new Date(prev.created_at).toDateString() !==
              new Date(msg.created_at).toDateString();

          return (
            <MessageItem
              key={msg.id}
              message={msg}
              isOwn={msg.user_id === user.id}
              showTeam={showTeam}
              showDate={showDate}
              read={readMap.get(msg.id) ?? false}
              channels={channels}
              isHighlighted={msg.id === highlightMessageId}
              onForward={onForward}
              onGoToSource={onGoToSource}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      {canWrite ? (
        <MessageInput
          onSend={handleSend}
          placeholder={
            channel.type === "announcement"
              ? "Объявление..."
              : "Написать сообщение..."
          }
        />
      ) : (
        <div className="chat-view__locked">Отправка недоступна</div>
      )}
    </div>
  );
}
