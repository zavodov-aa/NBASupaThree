import React, { useState, useEffect } from "react";
import "./tradeResultSuns.css";
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

const TradeResultSuns: React.FC = () => {
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
        .eq("trade_team", "Phoenix Suns")
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
        setError("Нет доступных трейдов для Phoenix Suns");
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
          .eq("trade_team", "Phoenix Suns")
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
    <div className={`resultSuns-playerCard resultSuns-playerCard--${type}`}>
      <div className="resultSuns-playerHeader">
        <div className="resultSuns-playerNameSection">
          <span className="resultSuns-playerName">{player.name}</span>
        </div>
        <span className="resultSuns-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultSuns-draftPickCard">
      <div className="resultSuns-pickHeader">
        <div className="resultSuns-pickInfo">
          <span className="resultSuns-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultSuns-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultSuns-pickDetails">
        <div className="resultSuns-pickTeam">
          <span className="resultSuns-teamLabel">От:</span>
          <span className="resultSuns-teamName" title={pick.originalTeam}>
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
        className={`resultSuns-tradeSection resultSuns-tradeSection--${type}`}
      >
        <div className="resultSuns-sectionHeader">
          <div className="resultSuns-sectionTitle">{title}</div>
          <div className="resultSuns-sectionCounts">
            {hasPlayers && (
              <span className="resultSuns-countBadge resultSuns-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultSuns-countBadge resultSuns-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultSuns-sectionContent resultSuns-sectionContent--players">
            <div className="resultSuns-contentLabel">Игроки:</div>
            <div className="resultSuns-cardsGrid">
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
          <div className="resultSuns-sectionContent resultSuns-sectionContent--picks">
            <div className="resultSuns-contentLabel">Драфт-пики:</div>
            <div className="resultSuns-cardsGrid">
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
    const isTeam1Suns = team1Name === "Phoenix Suns";
    const isTeam2Suns = team2Name === "Phoenix Suns";

    return (
      <div className="resultSuns-tradeData">
        <div className="resultSuns-tradeSummary">
          <div className="resultSuns-summaryStats">
            <div className="resultSuns-statItem">
              <div className="resultSuns-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultSuns-statLabel">
                активов от {isTeam2Suns ? "Phoenix Suns" : team2Name}
              </div>
            </div>
            <div className="resultSuns-exchangeArrow">⇄</div>
            <div className="resultSuns-statItem">
              <div className="resultSuns-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultSuns-statLabel">
                активов от {isTeam1Suns ? "Phoenix Suns" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultSuns-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultSuns-tradeDivider">
            <div className="resultSuns-dividerLine"></div>
            <div className="resultSuns-dividerText">Обмен</div>
            <div className="resultSuns-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultSuns-tradeNote">
            <div className="resultSuns-noteHeader">
              <span className="resultSuns-noteTitle">Примечание к трейду</span>
              <span className="resultSuns-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultSuns-noteContent">{data.tradeNote}</div>
          </div>
        )}

        <div className="resultSuns-tradeActions">
          <button
            className="resultSuns-actionButton resultSuns-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultSuns-actionButton resultSuns-actionButton--reject"
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
    <div className="resultSuns-container">
      <div className="resultSuns-controls">
        <button
          className={`resultSuns-button ${
            notificationCount > 0 ? "resultSuns-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultSuns-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultSuns-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultSuns-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultSuns-modalOverlay" onClick={closeModal}>
          <div
            className="resultSuns-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultSuns-modalHeader">
              <div className="resultSuns-headerContent">
                <div className="resultSuns-teamLogo"></div>
                <div className="resultSuns-headerInfo">
                  <h2>Трейды Phoenix Suns</h2>
                  <div className="resultSuns-headerSubtitle">
                    <span className="resultSuns-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultSuns-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultSuns-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultSuns-modalContent">
              {trades.length === 0 ? (
                <div className="resultSuns-noTrades">
                  <div className="resultSuns-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultSuns-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultSuns-tradeItem"
                    >
                      <div className="resultSuns-tradeHeader">
                        <div className="resultSuns-tradeMeta">
                          <span className="resultSuns-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultSuns-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultSuns-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultSuns-modalFooter">
              <button
                className="resultSuns-closeAllButton"
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

export default TradeResultSuns;
