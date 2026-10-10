import type { Channel } from "./types";

type Props = {
  channels: Channel[];
  activeId: string | null;
  onSelect: (channelId: string) => void;
  onNewDirect: () => void;
  currentTeam: string;
  unreadCounts: Record<string, number>;
};

export default function ChannelList({
  channels,
  activeId,
  onSelect,
  onNewDirect,
  currentTeam,
  unreadCounts,
}: Props) {
  const general = channels.filter((c) => c.type === "general");
  const announcements = channels.filter((c) => c.type === "announcement");
  const directs = channels.filter((c) => c.type === "direct");

  const renderBadge = (id: string) => {
    const n = unreadCounts[id] ?? 0;
    if (n <= 0) return null;
    return <span className="chat-channel__badge">{n > 99 ? "99+" : n}</span>;
  };

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar__header">
        <span>Чат</span>
      </div>

      <div className="chat-sidebar__section">
        {general.map((ch) => (
          <button
            key={ch.id}
            className={`chat-channel ${activeId === ch.id ? "chat-channel--active" : ""}`}
            onClick={() => onSelect(ch.id)}
          >
            <span className="chat-channel__label"># {ch.name}</span>
            {renderBadge(ch.id)}
          </button>
        ))}
        {announcements.map((ch) => (
          <button
            key={ch.id}
            className={`chat-channel ${activeId === ch.id ? "chat-channel--active" : ""}`}
            onClick={() => onSelect(ch.id)}
          >
            <span className="chat-channel__label">📢 {ch.name}</span>
            {renderBadge(ch.id)}
          </button>
        ))}
      </div>

      <div className="chat-sidebar__section">
        <div className="chat-sidebar__label">
          Личные
          <button className="chat-sidebar__add" onClick={onNewDirect}>
            + новая
          </button>
        </div>
        {directs.length === 0 && (
          <div className="chat-sidebar__empty">Нет личных переписок</div>
        )}
        {directs.map((ch) => {
          // показываем собеседника, а не полное имя "Lakers ↔ Bulls"
          const other = ch.team_ids?.find((t) => t !== currentTeam) ?? ch.name;
          return (
            <button
              key={ch.id}
              className={`chat-channel ${activeId === ch.id ? "chat-channel--active" : ""}`}
              onClick={() => onSelect(ch.id)}
            >
              <span className="chat-channel__label">{other}</span>
              {renderBadge(ch.id)}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
