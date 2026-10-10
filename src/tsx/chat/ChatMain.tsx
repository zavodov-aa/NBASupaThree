import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../authorization/AuthContext";
import ChannelList from "./ChannelList";
import ChannelView from "./ChannelView";
import ForwardPicker from "./ForwardPicker";
import { useChannels } from "./hooks/useChannels";
import { useUnreadCounts } from "./hooks/useUnreadCounts";
import { getOrCreateDirect, forwardMessage } from "./api/chat";
import type { Message } from "./types";
import HeaderChat from "./HeaderChat";

import "./css/chatMain.css";

const NBA_TEAMS = [
  "Commissioner",
  "Hawks",
  "Celtics",
  "Nets",
  "Hornets",
  "Bulls",
  "Cavaliers",
  "Mavericks",
  "Nuggets",
  "Pistons",
  "Warriors",
  "Rockets",
  "Pacers",
  "Clippers",
  "Lakers",
  "Grizzlies",
  "Heat",
  "Bucks",
  "Timberwolves",
  "Pelicans",
  "Knicks",
  "Thunder",
  "Magic",
  "76ers",
  "Suns",
  "Blazers",
  "Kings",
  "Spurs",
  "Raptors",
  "Jazz",
  "Wizards",
  "test",
];

type ChatLocationState = {
  highlightMessageId?: string;
};

export default function ChatMain() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { channelId } = useParams<{ channelId?: string }>();

  const { channels, loading, reload } = useChannels(user?.team);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerBusy, setPickerBusy] = useState(false);

  const [forwardSource, setForwardSource] = useState<Message | null>(null);
  const [forwardBusy, setForwardBusy] = useState(false);

  // мобильный drawer со списком каналов
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // id сообщения, к которому надо проскроллить и подсветить
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(
    null,
  );

  const channelIds = useMemo(() => channels.map((c) => c.id), [channels]);

  const { counts } = useUnreadCounts(user?.id, channelIds, channelId ?? null);

  useEffect(() => {
    if (loading || channels.length === 0) return;
    if (!channelId) {
      // navigate(`/chat/${channels[0].id}`, { replace: true });
      navigate(`/talk/${channels[0].id}`, { replace: true });
    }
  }, [loading, channels, channelId, navigate]);

  // читаем state при навигации "к оригиналу"
  useEffect(() => {
    const st = (location.state ?? {}) as ChatLocationState;
    if (st.highlightMessageId) {
      setHighlightMessageId(st.highlightMessageId);
      // очищаем state, чтобы при следующей навигации не подсвечивать снова
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // скролл к подсвеченному сообщению, когда оно отрендерится
  useEffect(() => {
    if (!highlightMessageId) return;
    const t = window.setTimeout(() => {
      const el = document.querySelector(
        `[data-message-id="${highlightMessageId}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // снимаем подсветку через 2 секунды
      window.setTimeout(() => setHighlightMessageId(null), 2000);
    }, 100);
    return () => window.clearTimeout(t);
  }, [highlightMessageId, channelId]);

  // автозакрытие drawer при смене канала
  useEffect(() => {
    setSidebarOpen(false);
  }, [channelId]);

  // закрытие drawer по Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const activeChannel = channels.find((c) => c.id === channelId) ?? null;

  const handleNewDirect = () => setPickerOpen(true);

  const handlePickTeam = async (otherTeam: string) => {
    if (!user) return;
    setPickerBusy(true);
    try {
      const ch = await getOrCreateDirect(user.team, otherTeam);
      await reload();
      setPickerOpen(false);
      // navigate(`/chat/${ch.id}`);
      navigate(`/talk/${ch.id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Не удалось открыть чат");
    } finally {
      setPickerBusy(false);
    }
  };

  const handleForwardPick = async (targetChannelId: string) => {
    if (!user || !forwardSource) return;
    const target = channels.find((c) => c.id === targetChannelId);
    if (!target) {
      alert("Канал не найден");
      return;
    }

    setForwardBusy(true);
    try {
      await forwardMessage({
        targetChannelId,
        targetChannelType: target.type,
        sourceMessage: forwardSource,
        userId: user.id,
        team: user.team,
        role: user.role,
      });
      setForwardSource(null);
      // navigate(`/chat/${targetChannelId}`);
      navigate(`/talk/${targetChannelId}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Не удалось переслать");
    } finally {
      setForwardBusy(false);
    }
  };

  // переход к оригиналу пересланного сообщения
  // (только для не-direct каналов)
  const handleGoToSource = (messageId: string, sourceChannelId: string) => {
    const src = channels.find((c) => c.id === sourceChannelId);
    if (!src || src.type === "direct") return;

    // navigate(`/chat/${sourceChannelId}`, {
    navigate(`/talk/${sourceChannelId}`, {
      state: { highlightMessageId: messageId } satisfies ChatLocationState,
    });
  };

  const pickableTeams = useMemo(
    () => (user ? NBA_TEAMS.filter((t) => t !== user.team) : []),
    [user],
  );

  if (!user) return null;

  const layoutClass =
    "chat-layout" + (sidebarOpen ? " chat-layout--sidebar-open" : "");

  return (
    <div className={layoutClass}>
      <HeaderChat />
      <ChannelList
        channels={channels}
        activeId={channelId ?? null}
        onSelect={(id) => {
          setSidebarOpen(false);
          // navigate(`/chat/${id}`);
          navigate(`/talk/${id}`);
        }}
        onNewDirect={handleNewDirect}
        currentTeam={user.team}
        unreadCounts={counts}
      />

      {activeChannel ? (
        <ChannelView
          key={activeChannel.id}
          channel={activeChannel}
          channels={channels}
          highlightMessageId={highlightMessageId}
          onForward={setForwardSource}
          onGoToSource={handleGoToSource}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      ) : (
        <div className="chat-view chat-view--empty">
          {loading ? "Загрузка..." : "Выбери канал"}
        </div>
      )}

      {/* Overlay: виден только на мобилке, когда drawer открыт */}
      {sidebarOpen && (
        <div
          className="chat-layout__overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {pickerOpen && (
        <div
          className="chat-picker-backdrop"
          onClick={() => setPickerOpen(false)}
        >
          <div className="chat-picker" onClick={(e) => e.stopPropagation()}>
            <div className="chat-picker__header">Кому написать?</div>
            <div className="chat-picker__list">
              {pickableTeams.map((t) => (
                <button
                  key={t}
                  className="chat-picker__item"
                  onClick={() => handlePickTeam(t)}
                  disabled={pickerBusy}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              className="chat-picker__close"
              onClick={() => setPickerOpen(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {forwardSource && (
        <ForwardPicker
          channels={channels}
          excludeChannelId={activeChannel?.id}
          busy={forwardBusy}
          onPick={handleForwardPick}
          onClose={() => setForwardSource(null)}
        />
      )}
    </div>
  );
}
