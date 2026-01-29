import React, { useState, useEffect } from "react";
import "./tradeResultPistons.css";
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

const TradeResultPistons: React.FC = () => {
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
        .eq("trade_team", "Detroit Pistons")
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
        setError("Нет доступных трейдов для Detroit Pistons");
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
          .eq("trade_team", "Detroit Pistons")
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
    <div
      className={`resultPistons-playerCard resultPistons-playerCard--${type}`}
    >
      <div className="resultPistons-playerHeader">
        <div className="resultPistons-playerNameSection">
          <span className="resultPistons-playerName">{player.name}</span>
        </div>
        <span className="resultPistons-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultPistons-draftPickCard">
      <div className="resultPistons-pickHeader">
        <div className="resultPistons-pickInfo">
          <span className="resultPistons-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultPistons-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultPistons-pickDetails">
        <div className="resultPistons-pickTeam">
          <span className="resultPistons-teamLabel">От:</span>
          <span className="resultPistons-teamName" title={pick.originalTeam}>
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
        className={`resultPistons-tradeSection resultPistons-tradeSection--${type}`}
      >
        <div className="resultPistons-sectionHeader">
          <div className="resultPistons-sectionTitle">{title}</div>
          <div className="resultPistons-sectionCounts">
            {hasPlayers && (
              <span className="resultPistons-countBadge resultPistons-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultPistons-countBadge resultPistons-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultPistons-sectionContent resultPistons-sectionContent--players">
            <div className="resultPistons-contentLabel">Игроки:</div>
            <div className="resultPistons-cardsGrid">
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
          <div className="resultPistons-sectionContent resultPistons-sectionContent--picks">
            <div className="resultPistons-contentLabel">Драфт-пики:</div>
            <div className="resultPistons-cardsGrid">
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
    const isTeam1Pistons = team1Name === "Detroit Pistons";
    const isTeam2Pistons = team2Name === "Detroit Pistons";

    return (
      <div className="resultPistons-tradeData">
        <div className="resultPistons-tradeSummary">
          <div className="resultPistons-summaryStats">
            <div className="resultPistons-statItem">
              <div className="resultPistons-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultPistons-statLabel">
                активов от {isTeam2Pistons ? "Detroit Pistons" : team2Name}
              </div>
            </div>
            <div className="resultPistons-exchangeArrow">⇄</div>
            <div className="resultPistons-statItem">
              <div className="resultPistons-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultPistons-statLabel">
                активов от {isTeam1Pistons ? "Detroit Pistons" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultPistons-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultPistons-tradeDivider">
            <div className="resultPistons-dividerLine"></div>
            <div className="resultPistons-dividerText">Обмен</div>
            <div className="resultPistons-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultPistons-tradeNote">
            <div className="resultPistons-noteHeader">
              <span className="resultPistons-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultPistons-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultPistons-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultPistons-tradeActions">
          <button
            className="resultPistons-actionButton resultPistons-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultPistons-actionButton resultPistons-actionButton--reject"
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
    <div className="resultPistons-container">
      <div className="resultPistons-controls">
        <button
          className={`resultPistons-button ${
            notificationCount > 0
              ? "resultPistons-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultPistons-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultPistons-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultPistons-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultPistons-modalOverlay" onClick={closeModal}>
          <div
            className="resultPistons-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultPistons-modalHeader">
              <div className="resultPistons-headerContent">
                <div className="resultPistons-teamLogo"></div>
                <div className="resultPistons-headerInfo">
                  <h2>Трейды Detroit Pistons</h2>
                  <div className="resultPistons-headerSubtitle">
                    <span className="resultPistons-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultPistons-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultPistons-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultPistons-modalContent">
              {trades.length === 0 ? (
                <div className="resultPistons-noTrades">
                  <div className="resultPistons-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultPistons-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultPistons-tradeItem"
                    >
                      <div className="resultPistons-tradeHeader">
                        <div className="resultPistons-tradeMeta">
                          <span className="resultPistons-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultPistons-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultPistons-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultPistons-modalFooter">
              <button
                className="resultPistons-closeAllButton"
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

export default TradeResultPistons;
