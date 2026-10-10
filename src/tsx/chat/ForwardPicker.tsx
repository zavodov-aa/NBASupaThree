import type { Channel } from "./types";

type Props = {
  channels: Channel[];
  excludeChannelId?: string;
  busy: boolean;
  onPick: (channelId: string) => void;
  onClose: () => void;
};

export default function ForwardPicker({
  channels,
  excludeChannelId,
  busy,
  onPick,
  onClose,
}: Props) {
  // нельзя пересылать в "Объявления" — единственное исключение
  const list = channels.filter(
    (c) => c.id !== excludeChannelId && c.type !== "announcement",
  );

  return (
    <div className="chat-picker-backdrop" onClick={onClose}>
      <div className="chat-picker" onClick={(e) => e.stopPropagation()}>
        <div className="chat-picker__header">Переслать в…</div>
        <div className="chat-picker__list">
          {list.length === 0 && (
            <div className="chat-picker__empty">Нет доступных каналов</div>
          )}
          {list.map((c) => (
            <button
              key={c.id}
              className="chat-picker__item"
              disabled={busy}
              onClick={() => onPick(c.id)}
            >
              {c.type === "general" ? `# ${c.name}` : (c.name ?? c.id)}
            </button>
          ))}
        </div>
        <button className="chat-picker__close" onClick={onClose}>
          Отмена
        </button>
      </div>
    </div>
  );
}
