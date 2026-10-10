import { useState, KeyboardEvent } from "react";

type Props = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
};

export default function MessageInput({ onSend, disabled, placeholder }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setText("");
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

  return (
    <div className="chat-input">
      <textarea
        className="chat-input__field"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
    </div>
  );
}
