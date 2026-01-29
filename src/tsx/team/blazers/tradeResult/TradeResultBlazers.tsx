import React, { useState, useEffect } from "react";
import "./tradeResultBlazers.css";
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

const TradeResultBlazers: React.FC = () => {
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
        .eq("trade_team", "Portland Trail Blazers")
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
        setError("Нет доступных трейдов для Portland Trail Blazers");
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
          .eq("trade_team", "Portland Trail Blazers")
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
      className={`resultBlazers-playerCard resultBlazers-playerCard--${type}`}
    >
      <div className="resultBlazers-playerHeader">
        <div className="resultBlazers-playerNameSection">
          <span className="resultBlazers-playerName">{player.name}</span>
        </div>
        <span className="resultBlazers-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultBlazers-draftPickCard">
      <div className="resultBlazers-pickHeader">
        <div className="resultBlazers-pickInfo">
          <span className="resultBlazers-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultBlazers-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultBlazers-pickDetails">
        <div className="resultBlazers-pickTeam">
          <span className="resultBlazers-teamLabel">От:</span>
          <span className="resultBlazers-teamName" title={pick.originalTeam}>
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
        className={`resultBlazers-tradeSection resultBlazers-tradeSection--${type}`}
      >
        <div className="resultBlazers-sectionHeader">
          <div className="resultBlazers-sectionTitle">{title}</div>
          <div className="resultBlazers-sectionCounts">
            {hasPlayers && (
              <span className="resultBlazers-countBadge resultBlazers-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultBlazers-countBadge resultBlazers-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultBlazers-sectionContent resultBlazers-sectionContent--players">
            <div className="resultBlazers-contentLabel">Игроки:</div>
            <div className="resultBlazers-cardsGrid">
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
          <div className="resultBlazers-sectionContent resultBlazers-sectionContent--picks">
            <div className="resultBlazers-contentLabel">Драфт-пики:</div>
            <div className="resultBlazers-cardsGrid">
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
    const isTeam1Blazers = team1Name === "Portland Trail Blazers";
    const isTeam2Blazers = team2Name === "Portland Trail Blazers";

    return (
      <div className="resultBlazers-tradeData">
        <div className="resultBlazers-tradeSummary">
          <div className="resultBlazers-summaryStats">
            <div className="resultBlazers-statItem">
              <div className="resultBlazers-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultBlazers-statLabel">
                активов от{" "}
                {isTeam2Blazers ? "Portland Trail Blazers" : team2Name}
              </div>
            </div>
            <div className="resultBlazers-exchangeArrow">⇄</div>
            <div className="resultBlazers-statItem">
              <div className="resultBlazers-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultBlazers-statLabel">
                активов от{" "}
                {isTeam1Blazers ? "Portland Trail Blazers" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultBlazers-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultBlazers-tradeDivider">
            <div className="resultBlazers-dividerLine"></div>
            <div className="resultBlazers-dividerText">Обмен</div>
            <div className="resultBlazers-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultBlazers-tradeNote">
            <div className="resultBlazers-noteHeader">
              <span className="resultBlazers-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultBlazers-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultBlazers-noteContent">{data.tradeNote}</div>
          </div>
        )}

        <div className="resultBlazers-tradeActions">
          <button
            className="resultBlazers-actionButton resultBlazers-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultBlazers-actionButton resultBlazers-actionButton--reject"
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
    <div className="resultBlazers-container">
      <div className="resultBlazers-controls">
        <button
          className={`resultBlazers-button ${
            notificationCount > 0
              ? "resultBlazers-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultBlazers-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultBlazers-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultBlazers-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultBlazers-modalOverlay" onClick={closeModal}>
          <div
            className="resultBlazers-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultBlazers-modalHeader">
              <div className="resultBlazers-headerContent">
                <div className="resultBlazers-teamLogo"></div>
                <div className="resultBlazers-headerInfo">
                  <h2>Трейды Portland Trail Blazers</h2>
                  <div className="resultBlazers-headerSubtitle">
                    <span className="resultBlazers-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultBlazers-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultBlazers-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultBlazers-modalContent">
              {trades.length === 0 ? (
                <div className="resultBlazers-noTrades">
                  <div className="resultBlazers-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultBlazers-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultBlazers-tradeItem"
                    >
                      <div className="resultBlazers-tradeHeader">
                        <div className="resultBlazers-tradeMeta">
                          <span className="resultBlazers-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultBlazers-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultBlazers-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultBlazers-modalFooter">
              <button
                className="resultBlazers-closeAllButton"
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

export default TradeResultBlazers;
