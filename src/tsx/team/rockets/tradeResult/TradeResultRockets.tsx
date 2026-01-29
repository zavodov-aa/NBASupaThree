import React, { useState, useEffect } from "react";
import "./tradeResultRockets.css";
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

const TradeResultRockets: React.FC = () => {
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
        .eq("trade_team", "Houston Rockets")
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
        setError("Нет доступных трейдов для Houston Rockets");
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
          .eq("trade_team", "Houston Rockets")
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
      className={`resultRockets-playerCard resultRockets-playerCard--${type}`}
    >
      <div className="resultRockets-playerHeader">
        <div className="resultRockets-playerNameSection">
          <span className="resultRockets-playerName">{player.name}</span>
        </div>
        <span className="resultRockets-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultRockets-draftPickCard">
      <div className="resultRockets-pickHeader">
        <div className="resultRockets-pickInfo">
          <span className="resultRockets-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultRockets-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultRockets-pickDetails">
        <div className="resultRockets-pickTeam">
          <span className="resultRockets-teamLabel">От:</span>
          <span className="resultRockets-teamName" title={pick.originalTeam}>
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
        className={`resultRockets-tradeSection resultRockets-tradeSection--${type}`}
      >
        <div className="resultRockets-sectionHeader">
          <div className="resultRockets-sectionTitle">{title}</div>
          <div className="resultRockets-sectionCounts">
            {hasPlayers && (
              <span className="resultRockets-countBadge resultRockets-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultRockets-countBadge resultRockets-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultRockets-sectionContent resultRockets-sectionContent--players">
            <div className="resultRockets-contentLabel">Игроки:</div>
            <div className="resultRockets-cardsGrid">
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
          <div className="resultRockets-sectionContent resultRockets-sectionContent--picks">
            <div className="resultRockets-contentLabel">Драфт-пики:</div>
            <div className="resultRockets-cardsGrid">
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
    const isTeam1Rockets = team1Name === "Houston Rockets";
    const isTeam2Rockets = team2Name === "Houston Rockets";

    return (
      <div className="resultRockets-tradeData">
        <div className="resultRockets-tradeSummary">
          <div className="resultRockets-summaryStats">
            <div className="resultRockets-statItem">
              <div className="resultRockets-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultRockets-statLabel">
                активов от {isTeam2Rockets ? "Houston Rockets" : team2Name}
              </div>
            </div>
            <div className="resultRockets-exchangeArrow">⇄</div>
            <div className="resultRockets-statItem">
              <div className="resultRockets-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultRockets-statLabel">
                активов от {isTeam1Rockets ? "Houston Rockets" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultRockets-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultRockets-tradeDivider">
            <div className="resultRockets-dividerLine"></div>
            <div className="resultRockets-dividerText">Обмен</div>
            <div className="resultRockets-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultRockets-tradeNote">
            <div className="resultRockets-noteHeader">
              <span className="resultRockets-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultRockets-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultRockets-noteContent">{data.tradeNote}</div>
          </div>
        )}

        <div className="resultRockets-tradeActions">
          <button
            className="resultRockets-actionButton resultRockets-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultRockets-actionButton resultRockets-actionButton--reject"
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
    <div className="resultRockets-container">
      <div className="resultRockets-controls">
        <button
          className={`resultRockets-button ${
            notificationCount > 0
              ? "resultRockets-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultRockets-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultRockets-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultRockets-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultRockets-modalOverlay" onClick={closeModal}>
          <div
            className="resultRockets-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultRockets-modalHeader">
              <div className="resultRockets-headerContent">
                <div className="resultRockets-teamLogo"></div>
                <div className="resultRockets-headerInfo">
                  <h2>Трейды Houston Rockets</h2>
                  <div className="resultRockets-headerSubtitle">
                    <span className="resultRockets-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultRockets-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultRockets-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultRockets-modalContent">
              {trades.length === 0 ? (
                <div className="resultRockets-noTrades">
                  <div className="resultRockets-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultRockets-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultRockets-tradeItem"
                    >
                      <div className="resultRockets-tradeHeader">
                        <div className="resultRockets-tradeMeta">
                          <span className="resultRockets-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultRockets-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultRockets-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultRockets-modalFooter">
              <button
                className="resultRockets-closeAllButton"
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

export default TradeResultRockets;
