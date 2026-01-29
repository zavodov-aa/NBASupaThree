import React, { useState, useEffect } from "react";
import "./tradeResultBulls.css";
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

const TradeResultBulls: React.FC = () => {
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
        .eq("trade_team", "Chicago Bulls")
        .is("result_team", null); // Только сделки без результата

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
        setError("Нет доступных трейдов для Chicago Bulls");
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
          .eq("trade_team", "Chicago Bulls")
          .is("result_team", null); // Только сделки без результата

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

      // Обновляем запись в базе данных
      const { error: updateError } = await supabase
        .from("Trades")
        .update({ result_team: result })
        .eq("id", tradeId);

      if (updateError) {
        console.error("Error updating trade:", updateError);
        return;
      }

      // Удаляем сделку из локального состояния
      setTrades((prevTrades) =>
        prevTrades.filter((trade) => trade.id !== tradeId),
      );

      // Обновляем счетчик уведомлений
      setNotificationCount((prevCount) => Math.max(0, prevCount - 1));
    } catch (err: any) {
      console.error("Error handling trade result:", err);
    } finally {
      setProcessingTradeId(null);

      // Закрываем модальное окно если сделок больше нет
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
    <div className={`resultBulls-playerCard resultBulls-playerCard--${type}`}>
      <div className="resultBulls-playerHeader">
        <div className="resultBulls-playerNameSection">
          <span className="resultBulls-playerName">{player.name}</span>
        </div>
        <span className="resultBulls-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultBulls-draftPickCard">
      <div className="resultBulls-pickHeader">
        <div className="resultBulls-pickInfo">
          <span className="resultBulls-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultBulls-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultBulls-pickDetails">
        <div className="resultBulls-pickTeam">
          <span className="resultBulls-teamLabel">От:</span>
          <span className="resultBulls-teamName" title={pick.originalTeam}>
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
        className={`resultBulls-tradeSection resultBulls-tradeSection--${type}`}
      >
        <div className="resultBulls-sectionHeader">
          <div className="resultBulls-sectionTitle">{title}</div>
          <div className="resultBulls-sectionCounts">
            {hasPlayers && (
              <span className="resultBulls-countBadge resultBulls-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultBulls-countBadge resultBulls-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultBulls-sectionContent resultBulls-sectionContent--players">
            <div className="resultBulls-contentLabel">Игроки:</div>
            <div className="resultBulls-cardsGrid">
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
          <div className="resultBulls-sectionContent resultBulls-sectionContent--picks">
            <div className="resultBulls-contentLabel">Драфт-пики:</div>
            <div className="resultBulls-cardsGrid">
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
    const isTeam1Bulls = team1Name === "Chicago Bulls";
    const isTeam2Bulls = team2Name === "Chicago Bulls";

    return (
      <div className="resultBulls-tradeData">
        <div className="resultBulls-tradeSummary">
          <div className="resultBulls-summaryStats">
            <div className="resultBulls-statItem">
              <div className="resultBulls-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultBulls-statLabel">
                активов от {isTeam2Bulls ? "Chicago Bulls" : team2Name}
              </div>
            </div>
            <div className="resultBulls-exchangeArrow">⇄</div>
            <div className="resultBulls-statItem">
              <div className="resultBulls-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultBulls-statLabel">
                активов от {isTeam1Bulls ? "Chicago Bulls" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultBulls-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultBulls-tradeDivider">
            <div className="resultBulls-dividerLine"></div>
            <div className="resultBulls-dividerText">Обмен</div>
            <div className="resultBulls-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultBulls-tradeNote">
            <div className="resultBulls-noteHeader">
              <span className="resultBulls-noteTitle">Примечание к трейду</span>
              <span className="resultBulls-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultBulls-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultBulls-tradeActions">
          <button
            className="resultBulls-actionButton resultBulls-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultBulls-actionButton resultBulls-actionButton--reject"
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
    <div className="resultBulls-container">
      <div className="resultBulls-controls">
        <button
          className={`resultBulls-button ${
            notificationCount > 0 ? "resultBulls-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultBulls-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultBulls-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultBulls-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultBulls-modalOverlay" onClick={closeModal}>
          <div
            className="resultBulls-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultBulls-modalHeader">
              <div className="resultBulls-headerContent">
                <div className="resultBulls-teamLogo"></div>
                <div className="resultBulls-headerInfo">
                  <h2>Трейды Chicago Bulls</h2>
                  <div className="resultBulls-headerSubtitle">
                    <span className="resultBulls-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultBulls-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultBulls-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultBulls-modalContent">
              {trades.length === 0 ? (
                <div className="resultBulls-noTrades">
                  <div className="resultBulls-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultBulls-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultBulls-tradeItem"
                    >
                      <div className="resultBulls-tradeHeader">
                        <div className="resultBulls-tradeMeta">
                          <span className="resultBulls-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultBulls-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultBulls-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultBulls-modalFooter">
              <button
                className="resultBulls-closeAllButton"
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

export default TradeResultBulls;
