// import { useState, KeyboardEvent } from "react";

// type Props = {
//   onSend: (text: string) => Promise<void>;
//   disabled?: boolean;
//   placeholder?: string;
// };

// export default function MessageInput({ onSend, disabled, placeholder }: Props) {
//   const [text, setText] = useState("");
//   const [sending, setSending] = useState(false);

//   const handleSend = async () => {
//     const trimmed = text.trim();
//     if (!trimmed || sending) return;

//     setSending(true);
//     try {
//       await onSend(trimmed);
//       setText("");
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//     // Shift+Enter — новая строка (по умолчанию)
//   };

//   return (
//     <div className="chat-input">
//       <textarea
//         className="chat-input__field"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder ?? "Написать сообщение..."}
//         disabled={disabled || sending}
//         rows={1}
//         maxLength={2000}
//       />
//       <button
//         className="chat-input__send"
//         onClick={handleSend}
//         disabled={disabled || sending || !text.trim()}
//       >
//         Отправить
//       </button>
//     </div>
//   );
// }

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { createPortal } from "react-dom";
import EmojiPicker from "./EmojiPicker";
import { INPUT_EMOJIS } from "./emojis";

type Props = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
};

export default function MessageInput({ onSend, disabled, placeholder }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setText("");
      // после отправки возвращаем фокус в поле
      requestAnimationFrame(() => textareaRef.current?.focus());
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter — новая строка (по умолчанию)
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Вставка эмодзи в текущую позицию курсора
  const handlePickEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setText((prev) => prev + emoji);
      return;
    }

    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);

    // не даём превысить лимит textarea (2000)
    if (next.length > 2000) return;

    setText(next);

    // после setState возвращаем курсор сразу после вставленного эмодзи
    requestAnimationFrame(() => {
      const pos = start + emoji.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  // автофокус при включении disabled=false (необязательно, но удобно)
  useEffect(() => {
    if (!disabled && !sending) {
      textareaRef.current?.focus();
    }
  }, [disabled, sending]);

  return (
    <div className="chat-input">
      <button
        type="button"
        className="chat-input__emoji-btn"
        onClick={() => setEmojiOpen(true)}
        disabled={disabled || sending}
        title="Эмодзи"
        aria-label="Вставить эмодзи"
      >
        😀
      </button>

      <textarea
        ref={textareaRef}
        className="chat-input__field"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? "Написать сообщение..."}
        disabled={disabled || sending}
        rows={1}
        maxLength={2000}
      />

      <button
        className="chat-input__send"
        onClick={handleSend}
        disabled={disabled || sending || !text.trim()}
      >
        Отправить
      </button>

      {emojiOpen &&
        createPortal(
          <EmojiPicker
            emojis={INPUT_EMOJIS}
            onPick={handlePickEmoji}
            onClose={() => setEmojiOpen(false)}
          />,
          document.body,
        )}
    </div>
  );
}
