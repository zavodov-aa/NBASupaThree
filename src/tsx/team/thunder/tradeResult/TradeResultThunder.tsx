import React, { useState, useEffect } from "react";
import "./tradeResultThunder.css";
import { supabase } from "../../../../Supabase";

interface TradeData {
  team1: string;
  team2: string;
  activePlayersFromTeam1: Array<{
    id: number;
    name: string;
    type: string;
    [key: string]: any;
  }>;
  activePlayersFromTeam2: Array<{
    id: number;
    name: string;
    type: string;
    [key: string]: any;
  }>;
  gLeaguePlayersFromTeam1: Array<{
    id: number;
    name: string;
    g_league: string | null;
    type: string;
    [key: string]: any;
  }>;
  gLeaguePlayersFromTeam2: Array<{
    id: number;
    name: string;
    g_league: string | null;
    type: string;
    [key: string]: any;
  }>;
  draftPicksFromTeam1: Array<{
    id: number;
    year: number;
    round: number;
    originalTeam: string;
    currentTeam: string;
    type: string;
    [key: string]: any;
  }>;
  draftPicksFromTeam2: Array<{
    id: number;
    year: number;
    round: number;
    originalTeam: string;
    currentTeam: string;
    type: string;
    [key: string]: any;
  }>;
  tradeNote: string;
  noteLength: number;
  [key: string]: any;
}

interface Trade {
  id: string | number;
  trade_team: string;
  data: TradeData;
  created_at: string;
  result_team?: string | null;
  [key: string]: any;
}

const TradeResultThunder: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTradeId, setProcessingTradeId] = useState<
    string | number | null
  >(null);

  const checkTrades = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("Trades")
        .select("*")
        .eq("trade_team", "Oklahoma City Thunder")
        .is("result_team", null);

      if (fetchError) {
        console.error("Error fetching trades:", fetchError);
        setError("Ошибка при загрузке трейдов");
        return;
      }

      const fetchedTrades: Trade[] = data || [];
      setTrades(fetchedTrades);
      setNotificationCount(fetchedTrades.length);

      if (fetchedTrades.length > 0) {
        setIsModalOpen(true);
      } else {
        setError("Нет доступных трейдов для Oklahoma City Thunder");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Произошла ошибка при проверке трейдов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkInitialTrades = async (): Promise<void> => {
      try {
        const { data, error: fetchError } = await supabase
          .from("Trades")
          .select("*")
          .eq("trade_team", "Oklahoma City Thunder")
          .is("result_team", null);

        if (fetchError) {
          console.error("Error fetching trades:", fetchError);
          return;
        }

        const fetchedTrades: Trade[] = data || [];
        setTrades(fetchedTrades);
        setNotificationCount(fetchedTrades.length);
      } catch (err: any) {
        console.error("Error:", err);
      }
    };

    checkInitialTrades();
  }, []);

  const closeModal = (): void => {
    setIsModalOpen(false);
    setNotificationCount(0);
  };

  const handleTradeResult = async (
    tradeId: string | number,
    result: "Принято" | "Отклонено",
  ): Promise<void> => {
    try {
      setProcessingTradeId(tradeId);

      const { error: updateError } = await supabase
        .from("Trades")
        .update({ result_team: result })
        .eq("id", tradeId);

      if (updateError) {
        console.error("Error updating trade:", updateError);
        return;
      }

      setTrades((prevTrades) =>
        prevTrades.filter((trade) => trade.id !== tradeId),
      );

      setNotificationCount((prevCount) => Math.max(0, prevCount - 1));
    } catch (err: any) {
      console.error("Error handling trade result:", err);
    } finally {
      setProcessingTradeId(null);

      if (trades.length <= 1) {
        setTimeout(() => {
          setIsModalOpen(false);
        }, 500);
      }
    }
  };

  const PlayerCard: React.FC<{
    player: any;
    type: "active" | "gleague";
  }> = ({ player, type }) => (
    <div
      className={`resultThunder-playerCard resultThunder-playerCard--${type}`}
    >
      <div className="resultThunder-playerHeader">
        <div className="resultThunder-playerNameSection">
          <span className="resultThunder-playerName">{player.name}</span>
        </div>
        <span className="resultThunder-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultThunder-draftPickCard">
      <div className="resultThunder-pickHeader">
        <div className="resultThunder-pickInfo">
          <span className="resultThunder-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultThunder-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultThunder-pickDetails">
        <div className="resultThunder-pickTeam">
          <span className="resultThunder-teamLabel">От:</span>
          <span className="resultThunder-teamName" title={pick.originalTeam}>
            {pick.originalTeam}
          </span>
        </div>
      </div>
    </div>
  );

  const TradeSection: React.FC<{
    title: string;
    players: any[];
    picks: any[];
    type: "team1" | "team2";
  }> = ({ title, players, picks, type }) => {
    const hasPlayers = players && players.length > 0;
    const hasPicks = picks && picks.length > 0;

    if (!hasPlayers && !hasPicks) return null;

    return (
      <div
        className={`resultThunder-tradeSection resultThunder-tradeSection--${type}`}
      >
        <div className="resultThunder-sectionHeader">
          <div className="resultThunder-sectionTitle">{title}</div>
          <div className="resultThunder-sectionCounts">
            {hasPlayers && (
              <span className="resultThunder-countBadge resultThunder-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultThunder-countBadge resultThunder-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultThunder-sectionContent resultThunder-sectionContent--players">
            <div className="resultThunder-contentLabel">Игроки:</div>
            <div className="resultThunder-cardsGrid">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  type={player.g_league ? "gleague" : "active"}
                />
              ))}
            </div>
          </div>
        )}

        {hasPicks && (
          <div className="resultThunder-sectionContent resultThunder-sectionContent--picks">
            <div className="resultThunder-contentLabel">Драфт-пики:</div>
            <div className="resultThunder-cardsGrid">
              {picks.map((pick) => (
                <DraftPickCard
                  key={`${pick.year}-${pick.round}-${pick.originalTeam}`}
                  pick={pick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTradeData = (data: TradeData, tradeId: string | number) => {
    const team1Players = [
      ...(data.activePlayersFromTeam1 || []),
      ...(data.gLeaguePlayersFromTeam1 || []),
    ];
    const team2Players = [
      ...(data.activePlayersFromTeam2 || []),
      ...(data.gLeaguePlayersFromTeam2 || []),
    ];

    const team1Name = data.team1 || "Team 1";
    const team2Name = data.team2 || "Team 2";
    const isTeam1Thunder = team1Name === "Oklahoma City Thunder";
    const isTeam2Thunder = team2Name === "Oklahoma City Thunder";

    return (
      <div className="resultThunder-tradeData">
        <div className="resultThunder-tradeSummary">
          <div className="resultThunder-summaryStats">
            <div className="resultThunder-statItem">
              <div className="resultThunder-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultThunder-statLabel">
                активов от{" "}
                {isTeam2Thunder ? "Oklahoma City Thunder" : team2Name}
              </div>
            </div>
            <div className="resultThunder-exchangeArrow">⇄</div>
            <div className="resultThunder-statItem">
              <div className="resultThunder-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultThunder-statLabel">
                активов от{" "}
                {isTeam1Thunder ? "Oklahoma City Thunder" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultThunder-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultThunder-tradeDivider">
            <div className="resultThunder-dividerLine"></div>
            <div className="resultThunder-dividerText">Обмен</div>
            <div className="resultThunder-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultThunder-tradeNote">
            <div className="resultThunder-noteHeader">
              <span className="resultThunder-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultThunder-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultThunder-noteContent">{data.tradeNote}</div>
          </div>
        )}

        <div className="resultThunder-tradeActions">
          <button
            className="resultThunder-actionButton resultThunder-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultThunder-actionButton resultThunder-actionButton--reject"
            onClick={() => handleTradeResult(tradeId, "Отклонено")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Отклонено"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="resultThunder-container">
      <div className="resultThunder-controls">
        <button
          className={`resultThunder-button ${
            notificationCount > 0
              ? "resultThunder-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultThunder-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultThunder-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultThunder-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultThunder-modalOverlay" onClick={closeModal}>
          <div
            className="resultThunder-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultThunder-modalHeader">
              <div className="resultThunder-headerContent">
                <div className="resultThunder-teamLogo"></div>
                <div className="resultThunder-headerInfo">
                  <h2>Трейды Oklahoma City Thunder</h2>
                  <div className="resultThunder-headerSubtitle">
                    <span className="resultThunder-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultThunder-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultThunder-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultThunder-modalContent">
              {trades.length === 0 ? (
                <div className="resultThunder-noTrades">
                  <div className="resultThunder-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultThunder-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultThunder-tradeItem"
                    >
                      <div className="resultThunder-tradeHeader">
                        <div className="resultThunder-tradeMeta">
                          <span className="resultThunder-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultThunder-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultThunder-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultThunder-modalFooter">
              <button
                className="resultThunder-closeAllButton"
                onClick={closeModal}
              >
                Закрыть все сделки
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeResultThunder;
