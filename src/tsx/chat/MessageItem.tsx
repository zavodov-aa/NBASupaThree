// import { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import type { Channel, Message, MessageReaction } from "./types";
// import ReadReceipt from "./ReadReceipt";
// import { QUICK_REACTIONS } from "./emojis";
// import { getTeamColor, isDark } from "./teamColors";

// type Props = {
//   message: Message;
//   isOwn: boolean;
//   showTeam: boolean;
//   showDate: boolean;
//   read: boolean;
//   channels: Channel[];
//   isHighlighted?: boolean;
//   reactions: MessageReaction[];
//   currentUserId: number;
//   onForward: (message: Message) => void;
//   onGoToSource: (messageId: string, channelId: string) => void;
//   onEdit: (message: Message, newText: string) => Promise<void>;
//   onDelete: (message: Message) => Promise<void>;
//   onToggleReaction: (messageId: string, emoji: string) => Promise<void>;
// };

// // Сколько эмодзи показываем в быстром ряду меню
// const QUICK_REACTIONS_IN_MENU = 8;

// function formatDate(iso: string): string {
//   const d = new Date(iso);
//   const today = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);

//   const sameDay = (a: Date, b: Date) =>
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate();

//   if (sameDay(d, today)) return "Сегодня";
//   if (sameDay(d, yesterday)) return "Вчера";
//   return d.toLocaleDateString("ru-RU", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

// export default function MessageItem({
//   message,
//   isOwn,
//   showTeam,
//   showDate,
//   read,
//   channels,
//   isHighlighted = false,
//   reactions,
//   currentUserId,
//   onForward,
//   onGoToSource,
//   onEdit,
//   onDelete,
//   onToggleReaction,
// }: Props) {
//   const [editing, setEditing] = useState(false);
//   const [draft, setDraft] = useState(message.text ?? "");
//   const [busy, setBusy] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

//   // ----- контекстное меню -----
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
//     null,
//   );
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const bubbleRef = useRef<HTMLDivElement | null>(null);

//   const time = new Date(message.created_at).toLocaleTimeString("ru-RU", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   const isDeleted = !!message.deleted_at;
//   const isForwarded = message.forwarded_text != null;

//   const canEdit = !isDeleted && !isForwarded && isOwn;
//   const canDelete = !isDeleted && isOwn;

//   // Реакции можно ставить на любое неудалённое сообщение,
//   // неважно своё или чужое.
//   const canReact = !isDeleted && !editing;

//   const hasMenuActions = canEdit || canDelete || canReact;

//   // ----- цвет команды отправителя (только для чужих сообщений) -----
//   const teamColor = !isOwn && !isDeleted ? getTeamColor(message.team) : null;
//   const teamTextColor = teamColor && isDark(teamColor) ? "#ffffff" : "#1f2937";
//   const teamStyle = teamColor
//     ? ({
//         "--team-color": teamColor,
//         "--team-text": teamTextColor,
//       } as React.CSSProperties)
//     : undefined;

//   // Группировка реакций
//   const groupedReactions = (() => {
//     const map = new Map<string, { count: number; mine: boolean }>();
//     for (const r of reactions) {
//       const cur = map.get(r.emoji) ?? { count: 0, mine: false };
//       cur.count += 1;
//       if (r.user_id === currentUserId) cur.mine = true;
//       map.set(r.emoji, cur);
//     }
//     return Array.from(map.entries());
//   })();

//   const sourceChannel = message.forwarded_from_channel_id
//     ? (channels.find((c) => c.id === message.forwarded_from_channel_id) ?? null)
//     : null;

//   const canGoToSource =
//     isForwarded &&
//     !!message.forwarded_from_message_id &&
//     !!sourceChannel &&
//     sourceChannel.type !== "direct";

//   const handleGoToSource = () => {
//     if (!canGoToSource) return;
//     onGoToSource(message.forwarded_from_message_id!, sourceChannel!.id);
//   };

//   // ----- позиционирование меню -----

//   const openMenuAt = (clientX: number, clientY: number) => {
//     // Меню стало шире из-за ряда эмодзи
//     const MENU_W = 260;
//     // Высота: ряд эмодзи (~48) + отступы (~16) + до 2 пунктов по 36
//     const MENU_H = 48 + 16 + 36 * 2;
//     const MARGIN = 8;

//     let left = clientX;
//     let top = clientY;

//     if (left + MENU_W > window.innerWidth - MARGIN) {
//       left = window.innerWidth - MENU_W - MARGIN;
//     }
//     if (left < MARGIN) left = MARGIN;

//     if (top + MENU_H > window.innerHeight - MARGIN) {
//       top = window.innerHeight - MENU_H - MARGIN;
//     }
//     if (top < MARGIN) top = MARGIN;

//     setMenuPos({ top, left });
//     setMenuOpen(true);
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//     setMenuPos(null);
//   };

//   const handleBubbleClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (editing || isDeleted || busy) return;

//     const target = e.target as HTMLElement;
//     if (target.closest("button, a, textarea, input, select")) return;

//     if (!hasMenuActions) return;

//     openMenuAt(e.clientX, e.clientY);
//   };

//   useEffect(() => {
//     if (!menuOpen) return;
//     const onDocClick = (e: MouseEvent) => {
//       const target = e.target as Node;
//       if (menuRef.current?.contains(target)) return;
//       if (bubbleRef.current?.contains(target)) return;
//       closeMenu();
//     };
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") closeMenu();
//     };
//     const onScroll = () => closeMenu();
//     const onResize = () => closeMenu();

//     document.addEventListener("mousedown", onDocClick);
//     document.addEventListener("keydown", onKey);
//     window.addEventListener("scroll", onScroll, true);
//     window.addEventListener("resize", onResize);
//     return () => {
//       document.removeEventListener("mousedown", onDocClick);
//       document.removeEventListener("keydown", onKey);
//       window.removeEventListener("scroll", onScroll, true);
//       window.removeEventListener("resize", onResize);
//     };
//   }, [menuOpen]);

//   // ----- редактирование -----

//   const startEdit = () => {
//     closeMenu();
//     setDraft(message.text ?? "");
//     setEditError(null);
//     setEditing(true);
//   };

//   const cancelEdit = () => {
//     setEditing(false);
//     setEditError(null);
//   };

//   const submitEdit = async () => {
//     const trimmed = draft.trim();
//     if (!trimmed) {
//       setEditError("Сообщение не может быть пустым");
//       return;
//     }
//     if (trimmed === (message.text ?? "").trim()) {
//       setEditing(false);
//       return;
//     }
//     setBusy(true);
//     setEditError(null);
//     try {
//       await onEdit(message, trimmed);
//       setEditing(false);
//     } catch (e) {
//       setEditError(e instanceof Error ? e.message : "Не удалось сохранить");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const handleDelete = async () => {
//     closeMenu();
//     setBusy(true);
//     try {
//       await onDelete(message);
//     } catch (e) {
//       console.error("Не удалось удалить сообщение:", e);
//     } finally {
//       setBusy(false);
//     }
//   };

//   // ----- реакция из меню -----

//   const handlePickReaction = async (emoji: string) => {
//     closeMenu();
//     try {
//       await onToggleReaction(message.id, emoji);
//     } catch (e) {
//       console.error("Не удалось поставить реакцию:", e);
//     }
//   };

//   // ----- разметка -----

//   const rowClass =
//     "chat-message-row" +
//     (isOwn ? " chat-message-row--own" : "") +
//     (isHighlighted ? " chat-message-row--highlight" : "") +
//     (isDeleted ? " chat-message-row--deleted" : "");

//   const bubbleClass =
//     "chat-message" +
//     (isOwn ? " chat-message--own" : "") +
//     (hasMenuActions && !editing && !isDeleted
//       ? " chat-message--clickable"
//       : "");

//   const showReactions = !isDeleted && !editing;

//   return (
//     <div
//       data-message-id={message.id}
//       data-team={message.team ?? undefined}
//       className={rowClass}
//       style={teamStyle}
//     >
//       {showDate && (
//         <div className="chat-message__date-separator">
//           <span className="chat-message__date-pill">
//             {formatDate(message.created_at)}
//           </span>
//         </div>
//       )}

//       {!isOwn && !isDeleted && !editing && (
//         <button
//           type="button"
//           className="chat-message-row__forward"
//           onClick={() => onForward(message)}
//           title="Переслать"
//           aria-label="Переслать"
//         >
//           ↪
//         </button>
//       )}

//       <div
//         ref={bubbleRef}
//         className={bubbleClass}
//         onClick={handleBubbleClick}
//         role={hasMenuActions && !editing && !isDeleted ? "button" : undefined}
//         tabIndex={hasMenuActions && !editing && !isDeleted ? 0 : undefined}
//         onKeyDown={(e) => {
//           if (
//             hasMenuActions &&
//             !editing &&
//             !isDeleted &&
//             (e.key === "Enter" || e.key === " ")
//           ) {
//             e.preventDefault();
//             const rect = bubbleRef.current?.getBoundingClientRect();
//             if (rect) openMenuAt(rect.left + rect.width / 2, rect.top + 10);
//           }
//         }}
//       >
//         {showTeam && !isDeleted && !editing && (
//           <div className="chat-message__team">{message.team}</div>
//         )}

//         {isDeleted ? (
//           <div className="chat-message__deleted-text">Сообщение удалено</div>
//         ) : editing ? (
//           <div className="chat-message__edit">
//             <textarea
//               className="chat-message__edit-input"
//               value={draft}
//               onChange={(e) => setDraft(e.target.value)}
//               maxLength={2000}
//               rows={3}
//               autoFocus
//               disabled={busy}
//               onKeyDown={(e) => {
//                 if (e.key === "Escape") {
//                   e.preventDefault();
//                   cancelEdit();
//                 }
//                 if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//                   e.preventDefault();
//                   submitEdit();
//                 }
//               }}
//             />
//             {editError && (
//               <div className="chat-message__edit-error">{editError}</div>
//             )}
//             <div className="chat-message__edit-actions">
//               <button
//                 type="button"
//                 className="chat-message__edit-btn chat-message__edit-btn--save"
//                 onClick={submitEdit}
//                 disabled={busy}
//               >
//                 Сохранить
//               </button>
//               <button
//                 type="button"
//                 className="chat-message__edit-btn"
//                 onClick={cancelEdit}
//                 disabled={busy}
//               >
//                 Отмена
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {isForwarded && (
//               <div className="chat-message__forwarded">
//                 <div className="chat-message__forwarded-label">
//                   Переслано от {message.forwarded_author_team ?? "—"}
//                   {canGoToSource && (
//                     <button
//                       type="button"
//                       className="chat-message__forwarded-link"
//                       onClick={handleGoToSource}
//                       title="Перейти к оригиналу"
//                     >
//                       перейти
//                     </button>
//                   )}
//                 </div>
//                 <div className="chat-message__forwarded-text">
//                   {message.forwarded_text}
//                 </div>
//               </div>
//             )}

//             {message.text && (
//               <div className="chat-message__text">{message.text}</div>
//             )}

//             {message.edited_at && (
//               <span
//                 className="chat-message__edited"
//                 title={new Date(message.edited_at).toLocaleString("ru-RU")}
//               >
//                 (изменено)
//               </span>
//             )}

//             {showReactions && groupedReactions.length > 0 && (
//               <div className="message__reactions">
//                 {groupedReactions.map(([emoji, info]) => (
//                   <button
//                     key={emoji}
//                     type="button"
//                     className={
//                       "reaction-pill" +
//                       (info.mine ? " reaction-pill--mine" : "")
//                     }
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onToggleReaction(message.id, emoji);
//                     }}
//                     title={info.mine ? "Убрать реакцию" : "Поставить реакцию"}
//                   >
//                     <span className="reaction-pill__emoji">{emoji}</span>
//                     <span className="reaction-pill__count">{info.count}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {!isDeleted && !editing && (
//           <div className="chat-message__meta">
//             <span className="chat-message__time">{time}</span>
//             {isOwn && <ReadReceipt read={read} />}
//           </div>
//         )}
//       </div>

//       {isOwn && !isDeleted && !editing && (
//         <button
//           type="button"
//           className="chat-message-row__forward"
//           onClick={() => onForward(message)}
//           title="Переслать"
//           aria-label="Переслать"
//         >
//           ↪
//         </button>
//       )}

//       {/* Контекстное меню с быстрыми реакциями + действия */}
//       {menuOpen &&
//         menuPos &&
//         createPortal(
//           <div
//             ref={menuRef}
//             className="chat-message-menu"
//             style={{ top: menuPos.top, left: menuPos.left }}
//             role="menu"
//           >
//             {canReact && (
//               <div className="chat-message-menu__reactions">
//                 {QUICK_REACTIONS.slice(0, QUICK_REACTIONS_IN_MENU).map((e) => (
//                   <button
//                     key={e}
//                     type="button"
//                     className="chat-message-menu__reaction"
//                     onClick={() => handlePickReaction(e)}
//                     title={`Реакция ${e}`}
//                   >
//                     {e}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {hasMenuActions && (canEdit || canDelete) && (
//               <div className="chat-message-menu__divider" />
//             )}

//             {canEdit && (
//               <button
//                 type="button"
//                 className="chat-message-menu__item"
//                 role="menuitem"
//                 onClick={startEdit}
//               >
//                 <span className="chat-message-menu__icon">✏️</span>
//                 Редактировать
//               </button>
//             )}
//             {canDelete && (
//               <button
//                 type="button"
//                 className="chat-message-menu__item chat-message-menu__item--danger"
//                 role="menuitem"
//                 onClick={handleDelete}
//               >
//                 <span className="chat-message-menu__icon">🗑</span>
//                 Удалить
//               </button>
//             )}
//           </div>,
//           document.body,
//         )}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Channel, Message, MessageReaction } from "./types";
import ReadReceipt from "./ReadReceipt";
import { QUICK_REACTIONS } from "./emojis";
import { getTeamColor, isDark } from "./teamColors";

type Props = {
  message: Message;
  isOwn: boolean;
  showTeam: boolean;
  showDate: boolean;
  read: boolean;
  channels: Channel[];
  isHighlighted?: boolean;
  reactions: MessageReaction[];
  currentUserId: number;
  onForward: (message: Message) => void;
  onGoToSource: (messageId: string, channelId: string) => void;
  onEdit: (message: Message, newText: string) => Promise<void>;
  onDelete: (message: Message) => Promise<void>;
  onToggleReaction: (messageId: string, emoji: string) => Promise<void>;
};

// Сколько эмодзи показываем в быстром ряду меню
const QUICK_REACTIONS_IN_MENU = 8;

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Сегодня";
  if (sameDay(d, yesterday)) return "Вчера";
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function MessageItem({
  message,
  isOwn,
  showTeam,
  showDate,
  read,
  channels,
  isHighlighted = false,
  reactions,
  currentUserId,
  onForward,
  onGoToSource,
  onEdit,
  onDelete,
  onToggleReaction,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.text ?? "");
  const [busy, setBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // ----- контекстное меню -----
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const time = new Date(message.created_at).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isDeleted = !!message.deleted_at;
  const isForwarded = message.forwarded_text != null;

  const canEdit = !isDeleted && !isForwarded && isOwn;
  const canDelete = !isDeleted && isOwn;

  // Реакции можно ставить на любое неудалённое сообщение,
  // неважно своё или чужое.
  const canReact = !isDeleted && !editing;

  const hasMenuActions = canEdit || canDelete || canReact;

  // ----- цвет команды отправителя (только для чужих сообщений) -----
  const teamColor = !isOwn && !isDeleted ? getTeamColor(message.team) : null;
  const teamTextColor = teamColor && isDark(teamColor) ? "#ffffff" : "#1f2937";
  const teamStyle = teamColor
    ? ({
        "--team-color": teamColor,
        "--team-text": teamTextColor,
      } as React.CSSProperties)
    : undefined;

  // Группировка реакций
  const groupedReactions = (() => {
    const map = new Map<string, { count: number; mine: boolean }>();
    for (const r of reactions) {
      const cur = map.get(r.emoji) ?? { count: 0, mine: false };
      cur.count += 1;
      if (r.user_id === currentUserId) cur.mine = true;
      map.set(r.emoji, cur);
    }
    return Array.from(map.entries());
  })();

  const sourceChannel = message.forwarded_from_channel_id
    ? (channels.find((c) => c.id === message.forwarded_from_channel_id) ?? null)
    : null;

  const canGoToSource =
    isForwarded &&
    !!message.forwarded_from_message_id &&
    !!sourceChannel &&
    sourceChannel.type !== "direct";

  const handleGoToSource = () => {
    if (!canGoToSource) return;
    onGoToSource(message.forwarded_from_message_id!, sourceChannel!.id);
  };

  // ----- позиционирование меню -----

  const openMenuAt = (clientX: number, clientY: number) => {
    // Меню стало шире из-за ряда эмодзи
    const MENU_W = 260;
    // Высота: ряд эмодзи (~48) + отступы (~16) + до 2 пунктов по 36
    const MENU_H = 48 + 16 + 36 * 2;
    const MARGIN = 8;

    let left = clientX;
    let top = clientY;

    if (left + MENU_W > window.innerWidth - MARGIN) {
      left = window.innerWidth - MENU_W - MARGIN;
    }
    if (left < MARGIN) left = MARGIN;

    if (top + MENU_H > window.innerHeight - MARGIN) {
      top = window.innerHeight - MENU_H - MARGIN;
    }
    if (top < MARGIN) top = MARGIN;

    setMenuPos({ top, left });
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuPos(null);
  };

  const handleBubbleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editing || isDeleted || busy) return;

    const target = e.target as HTMLElement;
    if (target.closest("button, a, textarea, input, select")) return;

    if (!hasMenuActions) return;

    openMenuAt(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (bubbleRef.current?.contains(target)) return;
      closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onScroll = () => closeMenu();
    const onResize = () => closeMenu();

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  // ----- редактирование -----

  const startEdit = () => {
    closeMenu();
    setDraft(message.text ?? "");
    setEditError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError(null);
  };

  const submitEdit = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setEditError("Сообщение не может быть пустым");
      return;
    }
    if (trimmed === (message.text ?? "").trim()) {
      setEditing(false);
      return;
    }
    setBusy(true);
    setEditError(null);
    try {
      await onEdit(message, trimmed);
      setEditing(false);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Не удалось сохранить");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    closeMenu();
    setBusy(true);
    try {
      await onDelete(message);
    } catch (e) {
      console.error("Не удалось удалить сообщение:", e);
    } finally {
      setBusy(false);
    }
  };

  // ----- реакция из меню -----

  const handlePickReaction = async (emoji: string) => {
    closeMenu();
    try {
      await onToggleReaction(message.id, emoji);
    } catch (e) {
      console.error("Не удалось поставить реакцию:", e);
    }
  };

  // ----- разметка -----

  const rowClass =
    "chat-message-row" +
    (isOwn ? " chat-message-row--own" : "") +
    (isHighlighted ? " chat-message-row--highlight" : "") +
    (isDeleted ? " chat-message-row--deleted" : "");

  const bubbleClass =
    "chat-message" +
    (isOwn ? " chat-message--own" : "") +
    (hasMenuActions && !editing && !isDeleted
      ? " chat-message--clickable"
      : "");

  const showReactions = !isDeleted && !editing;

  return (
    <>
      {showDate && (
        <div className="chat-message__date-separator">
          <span className="chat-message__date-pill">
            {formatDate(message.created_at)}
          </span>
        </div>
      )}

      <div
        data-message-id={message.id}
        data-team={message.team ?? undefined}
        className={rowClass}
        style={teamStyle}
      >
        {!isOwn && !isDeleted && !editing && (
          <button
            type="button"
            className="chat-message-row__forward"
            onClick={() => onForward(message)}
            title="Переслать"
            aria-label="Переслать"
          >
            ↪
          </button>
        )}

        <div
          ref={bubbleRef}
          className={bubbleClass}
          onClick={handleBubbleClick}
          role={hasMenuActions && !editing && !isDeleted ? "button" : undefined}
          tabIndex={hasMenuActions && !editing && !isDeleted ? 0 : undefined}
          onKeyDown={(e) => {
            if (
              hasMenuActions &&
              !editing &&
              !isDeleted &&
              (e.key === "Enter" || e.key === " ")
            ) {
              e.preventDefault();
              const rect = bubbleRef.current?.getBoundingClientRect();
              if (rect) openMenuAt(rect.left + rect.width / 2, rect.top + 10);
            }
          }}
        >
          {showTeam && !isDeleted && !editing && (
            <div className="chat-message__team">{message.team}</div>
          )}

          {isDeleted ? (
            <div className="chat-message__deleted-text">Сообщение удалено</div>
          ) : editing ? (
            <div className="chat-message__edit">
              <textarea
                className="chat-message__edit-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={2000}
                rows={3}
                autoFocus
                disabled={busy}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    cancelEdit();
                  }
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    submitEdit();
                  }
                }}
              />
              {editError && (
                <div className="chat-message__edit-error">{editError}</div>
              )}
              <div className="chat-message__edit-actions">
                <button
                  type="button"
                  className="chat-message__edit-btn chat-message__edit-btn--save"
                  onClick={submitEdit}
                  disabled={busy}
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  className="chat-message__edit-btn"
                  onClick={cancelEdit}
                  disabled={busy}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              {isForwarded && (
                <div className="chat-message__forwarded">
                  <div className="chat-message__forwarded-label">
                    Переслано от {message.forwarded_author_team ?? "—"}
                    {canGoToSource && (
                      <button
                        type="button"
                        className="chat-message__forwarded-link"
                        onClick={handleGoToSource}
                        title="Перейти к оригиналу"
                      >
                        перейти
                      </button>
                    )}
                  </div>
                  <div className="chat-message__forwarded-text">
                    {message.forwarded_text}
                  </div>
                </div>
              )}

              {message.text && (
                <div className="chat-message__text">{message.text}</div>
              )}

              {message.edited_at && (
                <span
                  className="chat-message__edited"
                  title={new Date(message.edited_at).toLocaleString("ru-RU")}
                >
                  (изменено)
                </span>
              )}

              {showReactions && groupedReactions.length > 0 && (
                <div className="message__reactions">
                  {groupedReactions.map(([emoji, info]) => (
                    <button
                      key={emoji}
                      type="button"
                      className={
                        "reaction-pill" +
                        (info.mine ? " reaction-pill--mine" : "")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleReaction(message.id, emoji);
                      }}
                      title={info.mine ? "Убрать реакцию" : "Поставить реакцию"}
                    >
                      <span className="reaction-pill__emoji">{emoji}</span>
                      <span className="reaction-pill__count">{info.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {!isDeleted && !editing && (
            <div className="chat-message__meta">
              <span className="chat-message__time">{time}</span>
              {isOwn && <ReadReceipt read={read} />}
            </div>
          )}
        </div>

        {isOwn && !isDeleted && !editing && (
          <button
            type="button"
            className="chat-message-row__forward"
            onClick={() => onForward(message)}
            title="Переслать"
            aria-label="Переслать"
          >
            ↪
          </button>
        )}

        {/* Контекстное меню с быстрыми реакциями + действия */}
        {menuOpen &&
          menuPos &&
          createPortal(
            <div
              ref={menuRef}
              className="chat-message-menu"
              style={{ top: menuPos.top, left: menuPos.left }}
              role="menu"
            >
              {canReact && (
                <div className="chat-message-menu__reactions">
                  {QUICK_REACTIONS.slice(0, QUICK_REACTIONS_IN_MENU).map(
                    (e) => (
                      <button
                        key={e}
                        type="button"
                        className="chat-message-menu__reaction"
                        onClick={() => handlePickReaction(e)}
                        title={`Реакция ${e}`}
                      >
                        {e}
                      </button>
                    ),
                  )}
                </div>
              )}

              {hasMenuActions && (canEdit || canDelete) && (
                <div className="chat-message-menu__divider" />
              )}

              {canEdit && (
                <button
                  type="button"
                  className="chat-message-menu__item"
                  role="menuitem"
                  onClick={startEdit}
                >
                  <span className="chat-message-menu__icon">✏️</span>
                  Редактировать
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  className="chat-message-menu__item chat-message-menu__item--danger"
                  role="menuitem"
                  onClick={handleDelete}
                >
                  <span className="chat-message-menu__icon">🗑</span>
                  Удалить
                </button>
              )}
            </div>,
            document.body,
          )}
      </div>
    </>
  );
}
