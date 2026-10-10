import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../../Supabase";
import "./tournament.css";
import logo from "../../../img/LogoLeague4kFinal.png";

/* ============================ Типы ============================ */

interface Team {
  path: string;
}

interface Matchup {
  id: number;
  team1: Team | null;
  team2: Team | null;
  round: number;
  score1: number;
  score2: number;
}

interface ConferenceData {
  matchups: Matchup[];
  expandedRounds: number[];
}

type ConferenceKey = "west" | "east";
type SlotKey = "team1" | "team2" | "west" | "east";

interface DropdownInfo {
  conference: ConferenceKey | "finals";
  matchupId?: number;
  slot: SlotKey;
  position: { top: number; left: number } | null;
}

interface TournamentData {
  version: 2;
  conferences: {
    west: ConferenceData;
    east: ConferenceData;
  };
  finals: {
    west: Team | null;
    east: Team | null;
    scoreWest: number;
    scoreEast: number;
  };
  savedAt: string;
}

/* ============================ Константы ============================ */

const CONFERENCE_CONFIG = {
  west: { title: "Western Conference", startId: 1 },
  east: { title: "Eastern Conference", startId: 17 },
} as const;

const ROUND_CONFIG = [
  { round: 1, title: "First Round" },
  { round: 2, title: "Semifinals" },
  { round: 3, title: "Conference Finals" },
  { round: 4, title: "Conference Champion" },
] as const;

const ROUND_MATCH_COUNTS = [4, 2, 1, 1] as const;

const MAX_SCORE = 4;
const MOBILE_BREAKPOINT = 767;
const DATA_VERSION = 2 as const;

const BASE_BRACKET_WIDTH = 1400;
const CONTENT_HORIZONTAL_PADDING = 60;

/* ============================ Утилиты ============================ */

const teamLabel = (path: string) => path.replace(".png", "").replace(/_/g, " ");

const clampScore = (value: number) => Math.max(0, Math.min(MAX_SCORE, value));

const isValidTournamentData = (data: unknown): data is TournamentData => {
  if (!data || typeof data !== "object") return false;
  const d = data as any;
  return (
    d.version === DATA_VERSION &&
    d.conferences?.west?.matchups &&
    d.conferences?.east?.matchups &&
    d.finals
  );
};

/* ============================ Компоненты ============================ */

const ScoreDisplay: React.FC<{
  score1: number;
  score2: number;
  isFinals?: boolean;
}> = ({ score1, score2, isFinals = false }) => (
  <div
    className={`tournamentMainn-score-display ${
      isFinals ? "tournamentMainn-finals-score" : ""
    }`}
  >
    <div className="tournamentMainn-score-team">{score1}</div>
    <div className="tournamentMainn-score-separator">-</div>
    <div className="tournamentMainn-score-team">{score2}</div>
  </div>
);

const TeamSlot: React.FC<{
  type: "west" | "east" | "finals";
  team: Team | null;
  placeholder: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}> = ({ type, team, placeholder, isActive, onClick }) => {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div className="tournamentMainn-team-slot-container">
      <div
        className={`tournamentMainn-team-slot ${
          isActive ? "tournamentMainn-active" : ""
        } ${type === "finals" ? "tournamentMainn-finals-slot" : ""}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKey}
      >
        <div className="tournamentMainn-team-content">
          {team ? (
            <img
              src={`/img/${team.path}`}
              alt={teamLabel(team.path)}
              className={`tournamentMainn-team-logo ${
                type === "finals" ? "tournamentMainn-finals-logo" : ""
              }`}
              onError={(e) => (e.currentTarget.src = "/img/placeholder.png")}
            />
          ) : (
            <span className="tournamentMainn-placeholder">{placeholder}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const EditableScore: React.FC<{
  score: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}> = ({ score, onChange, disabled = false, label }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(score));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) setDraft(String(score));
  }, [score, editing]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setDraft(String(score));
    setEditing(true);
  };

  const commit = () => {
    const parsed = parseInt(draft, 10);
    const next = Number.isNaN(parsed) ? 0 : clampScore(parsed);
    onChange(next);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(String(score));
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <div className="tournamentMainn-score-row">
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="tournamentMainn-score-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        />
      ) : (
        <div
          className={`tournamentMainn-score-value ${
            disabled ? "tournamentMainn-score-value-disabled" : ""
          }`}
          onClick={startEditing}
          role="button"
          tabIndex={0}
          title={disabled ? "" : "Нажмите, чтобы изменить счёт"}
        >
          {score}
        </div>
      )}
      {label && <div className="tournamentMainn-score-label">{label}</div>}
    </div>
  );
};

/* ============================ Начальное состояние ============================ */

const createInitialMatchups = (startId: number): Matchup[] => {
  const matchups: Matchup[] = [];
  let id = startId;

  ROUND_MATCH_COUNTS.forEach((count, roundIndex) => {
    for (let i = 0; i < count; i++) {
      matchups.push({
        id: id++,
        team1: null,
        team2: null,
        round: roundIndex + 1,
        score1: 0,
        score2: 0,
      });
    }
  });

  return matchups;
};

const createConference = (startId: number): ConferenceData => ({
  matchups: createInitialMatchups(startId),
  expandedRounds: [1],
});

const createInitialConferences = () => ({
  west: createConference(CONFERENCE_CONFIG.west.startId),
  east: createConference(CONFERENCE_CONFIG.east.startId),
});

const createInitialFinals = () => ({
  west: null as Team | null,
  east: null as Team | null,
  scoreWest: 0,
  scoreEast: 0,
});

/* ============================ Основной компонент ============================ */

const Tournament = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownInfo, setDropdownInfo] = useState<DropdownInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);

  const [conferences, setConferences] = useState(createInitialConferences);
  const [finals, setFinals] = useState(createInitialFinals);

  const [scale, setScale] = useState(1);
  const bracketRef = useRef<HTMLDivElement>(null);

  /* ---------- Загрузка данных ---------- */
  useEffect(() => {
    const loadData = async () => {
      await fetchTeams();
      await loadSavedTournament();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Единый слушатель resize ---------- */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setScale(1);
        return;
      }

      const available = window.innerWidth - CONTENT_HORIZONTAL_PADDING;
      const next = Math.min(1, available / BASE_BRACKET_WIDTH);
      setScale(next > 0 ? next : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Блокировка скролла body при открытом dropdown на мобилке ---------- */
  useEffect(() => {
    if (isMobile && dropdownInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dropdownInfo, isMobile]);

  /* ---------- Загрузка команд ---------- */
  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("IMG_path")
        .select("path")
        .order("path", { ascending: true });

      if (error) throw error;
      setTeams((data || []).map((item) => ({ path: item.path })));
    } catch (error) {
      console.error("Ошибка при загрузке команд:", error);
    }
  };

  /* ---------- Загрузка сохранённого турнира ---------- */
  const loadSavedTournament = async () => {
    try {
      const { data, error } = await supabase
        .from("Tournament27")
        .select("*")
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0 || !data[0].data) {
        console.log("Сохранённый турнир не найден");
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(data[0].data);
      } catch (parseError) {
        console.error("Ошибка при парсинге сохранённых данных:", parseError);
        return;
      }

      if (isValidTournamentData(parsed)) {
        setConferences(parsed.conferences);
        setFinals(parsed.finals);
        setHasLoadedSavedData(true);
        console.log("Турнир успешно загружен из базы данных");
      } else {
        console.warn("Неизвестный формат данных турнира, пропускаем загрузку");
      }
    } catch (error) {
      console.error("Ошибка при загрузке турнира:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Установка счёта матча конференции ---------- */
  const setMatchupScore = useCallback(
    (
      conference: ConferenceKey,
      matchupId: number,
      teamSlot: "team1" | "team2",
      value: number,
    ) => {
      setConferences((prev) => ({
        ...prev,
        [conference]: {
          ...prev[conference],
          matchups: prev[conference].matchups.map((m) => {
            if (m.id !== matchupId) return m;
            const scoreKey = teamSlot === "team1" ? "score1" : "score2";
            return { ...m, [scoreKey]: clampScore(value) };
          }),
        },
      }));
    },
    [],
  );

  /* ---------- Установка счёта финала ---------- */
  const setFinalsScore = useCallback(
    (teamSlot: "west" | "east", value: number) => {
      setFinals((prev) => {
        const key = teamSlot === "west" ? "scoreWest" : "scoreEast";
        return { ...prev, [key]: clampScore(value) };
      });
    },
    [],
  );

  /* ---------- Выбор команды (со сбросом счёта) ---------- */
  const handleTeamSelect = useCallback(
    (
      conference: ConferenceKey | "finals",
      matchupId: number,
      slot: SlotKey,
      team: Team,
    ) => {
      if (conference === "finals") {
        setFinals((prev) => ({
          ...prev,
          [slot]: team,
          ...(slot === "west" ? { scoreWest: 0 } : { scoreEast: 0 }),
        }));
        setDropdownInfo(null);
        return;
      }

      setConferences((prev) => ({
        ...prev,
        [conference]: {
          ...prev[conference],
          matchups: prev[conference].matchups.map((m) => {
            if (m.id !== matchupId) return m;
            return slot === "team1"
              ? { ...m, team1: team, score1: 0 }
              : { ...m, team2: team, score2: 0 };
          }),
        },
      }));
      setDropdownInfo(null);
    },
    [],
  );

  /* ---------- Клик по слоту команды ---------- */
  const handleTeamSlotClick = useCallback(
    (
      e: React.MouseEvent,
      conference: ConferenceKey | "finals",
      matchupId: number,
      slot: SlotKey,
    ) => {
      e.stopPropagation();
      const buttonRect = e.currentTarget.getBoundingClientRect();

      if (isMobile) {
        setDropdownInfo({ conference, matchupId, slot, position: null });
        return;
      }

      const dropdownWidth = 280;
      const dropdownHeight = 380;
      let top = buttonRect.bottom + 8;
      let left = buttonRect.left;

      if (top + dropdownHeight > window.innerHeight) {
        top = buttonRect.top - dropdownHeight - 8;
        if (top < 0) top = 8;
      }
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 8;
      }
      if (left < 0) left = 8;

      setDropdownInfo({ conference, matchupId, slot, position: { top, left } });
    },
    [isMobile],
  );

  /* ---------- Разворачивание/сворачивание раунда (мобилка) ---------- */
  const toggleRound = useCallback(
    (conference: ConferenceKey, round: number) => {
      setConferences((prev) => ({
        ...prev,
        [conference]: {
          ...prev[conference],
          expandedRounds: prev[conference].expandedRounds.includes(round)
            ? prev[conference].expandedRounds.filter((r) => r !== round)
            : [...prev[conference].expandedRounds, round],
        },
      }));
    },
    [],
  );

  /* ---------- Сохранение турнира ---------- */
  const saveTournament = async () => {
    setSaving(true);
    try {
      const tournamentData: TournamentData = {
        version: DATA_VERSION,
        conferences,
        finals,
        savedAt: new Date().toISOString(),
      };

      const { data: existingData, error: fetchError } = await supabase
        .from("Tournament27")
        .select("id")
        .limit(1);

      if (fetchError) throw fetchError;

      const payload = { data: JSON.stringify(tournamentData) };

      if (existingData && existingData.length > 0) {
        const { error } = await supabase
          .from("Tournament27")
          .update(payload)
          .eq("id", existingData[0].id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("Tournament27").insert([payload]);
        if (error) throw error;
      }

      setHasLoadedSavedData(true);
      alert("Турнир успешно сохранён!");
    } catch (error) {
      console.error("Ошибка при сохранении турнира:", error);
      alert("Произошла ошибка при сохранении турнира");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Рендер одного матча ---------- */
  const renderMatchup = useCallback(
    (matchup: Matchup, conference: ConferenceKey) => {
      if (matchup.round === 4) {
        return (
          <div
            key={matchup.id}
            className={`tournamentMainn-champion-slot tournamentMainn-champion-${conference}`}
          >
            <TeamSlot
              type={conference}
              team={matchup.team1}
              placeholder="Выберите чемпиона"
              isActive={
                dropdownInfo?.conference === conference &&
                dropdownInfo?.matchupId === matchup.id &&
                dropdownInfo?.slot === "team1"
              }
              onClick={(e) =>
                handleTeamSlotClick(e, conference, matchup.id, "team1")
              }
            />
            <div className="tournamentMainn-badge">Champion</div>
          </div>
        );
      }

      return (
        <div
          key={matchup.id}
          className={`tournamentMainn-matchup tournamentMainn-round-${matchup.round}`}
        >
          <div className="tournamentMainn-matchup-teams">
            <div className="tournamentMainn-matchup-row">
              <TeamSlot
                type={conference}
                team={matchup.team1}
                placeholder="—"
                isActive={
                  dropdownInfo?.conference === conference &&
                  dropdownInfo?.matchupId === matchup.id &&
                  dropdownInfo?.slot === "team1"
                }
                onClick={(e) =>
                  handleTeamSlotClick(e, conference, matchup.id, "team1")
                }
              />
              <EditableScore
                score={matchup.score1}
                onChange={(value) =>
                  setMatchupScore(conference, matchup.id, "team1", value)
                }
                disabled={!matchup.team1}
              />
            </div>

            <div className="tournamentMainn-matchup-row">
              <TeamSlot
                type={conference}
                team={matchup.team2}
                placeholder="—"
                isActive={
                  dropdownInfo?.conference === conference &&
                  dropdownInfo?.matchupId === matchup.id &&
                  dropdownInfo?.slot === "team2"
                }
                onClick={(e) =>
                  handleTeamSlotClick(e, conference, matchup.id, "team2")
                }
              />
              <EditableScore
                score={matchup.score2}
                onChange={(value) =>
                  setMatchupScore(conference, matchup.id, "team2", value)
                }
                disabled={!matchup.team2}
              />
            </div>
          </div>
        </div>
      );
    },
    [dropdownInfo, handleTeamSlotClick, setMatchupScore],
  );

  /* ---------- Рендер раундов (общий для mobile/desktop) ---------- */
  const renderRounds = useCallback(
    (conference: ConferenceKey) => {
      const { matchups, expandedRounds } = conferences[conference];

      return ROUND_CONFIG.map(({ round, title }) => {
        const isExpanded = expandedRounds.includes(round);
        const roundMatchups = matchups.filter((m) => m.round === round);

        if (isMobile) {
          return (
            <div
              key={round}
              className={`tournamentMainn-round tournamentMainn-round-${round} ${
                isExpanded ? "tournamentMainn-expanded" : ""
              }`}
              onClick={() => toggleRound(conference, round)}
            >
              <h3>
                {title}
                <span className="tournamentMainn-match-count">
                  ({roundMatchups.length})
                </span>
                <span className="tournamentMainn-expand-icon">
                  {isExpanded ? "−" : "+"}
                </span>
              </h3>
              <div
                className="tournamentMainn-round-content"
                onClick={(e) => e.stopPropagation()}
              >
                {roundMatchups.map((m) => renderMatchup(m, conference))}
              </div>
            </div>
          );
        }

        return (
          <div
            key={round}
            className={`tournamentMainn-round tournamentMainn-round-${round}`}
          >
            <h3>{title}</h3>
            <div className="tournamentMainn-round-content">
              {roundMatchups.map((m) => renderMatchup(m, conference))}
            </div>
          </div>
        );
      });
    },
    [conferences, isMobile, toggleRound, renderMatchup],
  );

  /* ---------- Рендер конференции ---------- */
  const renderConference = useCallback(
    (conference: ConferenceKey) => {
      const config = CONFERENCE_CONFIG[conference];

      return (
        <div
          className={`tournamentMainn-conference tournamentMainn-${conference}`}
        >
          <h2>{config.title}</h2>
          <div
            className={`tournamentMainn-bracket ${
              isMobile
                ? "tournamentMainn-mobile-bracket"
                : "tournamentMainn-bracket-horizontal"
            }`}
          >
            {renderRounds(conference)}
          </div>
        </div>
      );
    },
    [isMobile, renderRounds],
  );

  /* ---------- Рендер финала ---------- */
  const renderFinals = useCallback(
    () => (
      <div className="tournamentMainn-finals">
        <div className="tournamentMainn-finals-container">
          <h2>NBA Finals</h2>
          <div className="tournamentMainn-finals-matchup">
            <TeamSlot
              type="finals"
              team={finals.west}
              placeholder="West Champion"
              isActive={
                dropdownInfo?.conference === "finals" &&
                dropdownInfo?.slot === "west"
              }
              onClick={(e) => handleTeamSlotClick(e, "finals", 0, "west")}
            />

            <div className="tournamentMainn-finals-controls">
              <EditableScore
                score={finals.scoreWest}
                onChange={(value) => setFinalsScore("west", value)}
                label="West"
                disabled={!finals.west}
              />
              <ScoreDisplay
                score1={finals.scoreWest}
                score2={finals.scoreEast}
                isFinals
              />
              <EditableScore
                score={finals.scoreEast}
                onChange={(value) => setFinalsScore("east", value)}
                label="East"
                disabled={!finals.east}
              />
            </div>

            <TeamSlot
              type="finals"
              team={finals.east}
              placeholder="East Champion"
              isActive={
                dropdownInfo?.conference === "finals" &&
                dropdownInfo?.slot === "east"
              }
              onClick={(e) => handleTeamSlotClick(e, "finals", 0, "east")}
            />
          </div>
          <div className="tournamentMainn-nba-champion">
            <div className="tournamentMainn-trophy">🏆</div>
            <div className="tournamentMainn-champion-label">NBA Champion</div>
          </div>
        </div>
      </div>
    ),
    [dropdownInfo, finals, handleTeamSlotClick, setFinalsScore],
  );

  /* ---------- Мобильная навигация ---------- */
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

  if (loading)
    return <div className="tournamentMainn-loading">Загрузка команд...</div>;

  return (
    <div className="tournamentMainn-wrapper">
      <div
        className="tournamentMainn-container"
        onClick={() => setDropdownInfo(null)}
      >
        <div className="tournamentMainn-header">
          <div className="tournamentMainn-header-content">
            <a href="/" className="tournamentMainn-logo-link">
              <img src={logo} alt="NBA Logo" className="tournamentMainn-logo" />
            </a>
            <div className="tournamentMainn-header-title">
              <h1>NBA Playoffs Bracket</h1>
              <div className="tournamentMainn-save-container">
                <div className="tournamentMainn-save-buttons">
                  <button
                    className="tournamentMainn-save-button"
                    onClick={saveTournament}
                    disabled={saving}
                  >
                    {saving ? "Сохранение..." : "Сохранить турнир"}
                  </button>
                </div>
                {hasLoadedSavedData && (
                  <div className="tournamentMainn-saved-indicator">
                    Загружены сохранённые данные
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="tournamentMainn-content">
          <div className="tournamentMainn-scaler">
            <div
              className="tournamentMainn-scaler-inner"
              ref={bracketRef}
              style={{ transform: `scale(${scale})` }}
            >
              <div className="tournamentMainn-playoff-bracket">
                {renderConference("west")}
                {renderFinals()}
                {renderConference("east")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {dropdownInfo && (
        <div
          className="tournamentMainn-dropdown-overlay"
          onClick={() => setDropdownInfo(null)}
        >
          <div
            className="tournamentMainn-dropdown-fixed"
            style={
              !isMobile && dropdownInfo.position
                ? {
                    top: `${dropdownInfo.position.top}px`,
                    left: `${dropdownInfo.position.left}px`,
                  }
                : {}
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tournamentMainn-dropdown-header">
              <h4>Выберите команду</h4>
              <button
                className="tournamentMainn-dropdown-close"
                onClick={() => setDropdownInfo(null)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="tournamentMainn-dropdown-grid">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="tournamentMainn-dropdown-item"
                  onClick={() =>
                    handleTeamSelect(
                      dropdownInfo.conference,
                      dropdownInfo.matchupId || 0,
                      dropdownInfo.slot,
                      team,
                    )
                  }
                  title={teamLabel(team.path)}
                >
                  <img
                    src={`/img/${team.path}`}
                    alt={teamLabel(team.path)}
                    className="tournamentMainn-item-logo"
                    onError={(e) =>
                      (e.currentTarget.src = "/img/placeholder.png")
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="tournamentMainn-mobile-nav">
          <button
            className="tournamentMainn-mobile-nav-button tournamentMainn-up"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            ↑
          </button>
          <button
            className="tournamentMainn-mobile-nav-button tournamentMainn-down"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
};

export default Tournament;
