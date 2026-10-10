import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Channel, Message } from "./types";
import ReadReceipt from "./ReadReceipt";

type Props = {
  message: Message;
  isOwn: boolean;
  showTeam: boolean;
  showDate: boolean;
  read: boolean;
  channels: Channel[];
  isHighlighted?: boolean;
  onForward: (message: Message) => void;
  onGoToSource: (messageId: string, channelId: string) => void;
  onEdit: (message: Message, newText: string) => Promise<void>;
  onDelete: (message: Message) => Promise<void>;
};

/**
 * Умный формат даты:
 *  - "Сегодня" для текущего дня,
 *  - "Вчера" для предыдущего,
 *  - иначе — ДД.ММ.ГГГГ.
 */
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
  onForward,
  onGoToSource,
  onEdit,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.text ?? "");
  const [busy, setBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // ----- контекстное меню (edit/delete), открывается по клику на бабл -----
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

  // Редактировать и удалять можно ТОЛЬКО свои сообщения.
  const canEdit = !isDeleted && !isForwarded && isOwn;
  const canDelete = !isDeleted && isOwn;
  const hasMenuActions = canEdit || canDelete;

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
    const MENU_W = 180;
    const MENU_H = 90;
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

  // клик по баблу — открываем меню (только если есть что показать)
  const handleBubbleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editing || isDeleted || busy) return;

    const target = e.target as HTMLElement;
    if (target.closest("button, a, textarea, input, select")) return;

    if (!hasMenuActions) return;

    openMenuAt(e.clientX, e.clientY);
  };

  // закрытие меню по клику вне, Escape, скроллу и ресайзу
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

  return (
    <div data-message-id={message.id} className={rowClass}>
      {/* Разделитель с датой — над первым сообщением дня */}
      {showDate && (
        <div className="chat-message__date-separator">
          <span className="chat-message__date-pill">
            {formatDate(message.created_at)}
          </span>
        </div>
      )}

      {/* у чужих кнопка пересылки слева */}
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
        {/* Имя команды — только у первого сообщения серии */}
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
          </>
        )}

        {/* Мета: время всегда, галочки — только у своих */}
        {!isDeleted && !editing && (
          <div className="chat-message__meta">
            <span className="chat-message__time">{time}</span>
            {isOwn && <ReadReceipt read={read} />}
          </div>
        )}
      </div>

      {/* у своих кнопка пересылки справа */}
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

      {/* Контекстное меню */}
      {menuOpen &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            className="chat-message-menu"
            style={{ top: menuPos.top, left: menuPos.left }}
            role="menu"
          >
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
  );
}
