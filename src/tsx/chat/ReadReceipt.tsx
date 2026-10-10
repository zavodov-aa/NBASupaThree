type Props = {
  read: boolean;
};

export default function ReadReceipt({ read }: Props) {
  return (
    <span
      className={`chat-message__receipt ${
        read ? "chat-message__receipt--read" : ""
      }`}
      aria-label={read ? "Прочитано" : "Отправлено"}
    >
      {read ? "✓✓" : "✓"}
    </span>
  );
}
