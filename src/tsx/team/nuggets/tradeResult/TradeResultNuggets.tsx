import React, { useState, useEffect } from "react";
import "./tradeResultNuggets.css";
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

const TradeResultNuggets: React.FC = () => {
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
        .eq("trade_team", "Denver Nuggets")
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
        setError("Нет доступных трейдов для Denver Nuggets");
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
          .eq("trade_team", "Denver Nuggets")
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
      className={`resultNuggets-playerCard resultNuggets-playerCard--${type}`}
    >
      <div className="resultNuggets-playerHeader">
        <div className="resultNuggets-playerNameSection">
          <span className="resultNuggets-playerName">{player.name}</span>
        </div>
        <span className="resultNuggets-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultNuggets-draftPickCard">
      <div className="resultNuggets-pickHeader">
        <div className="resultNuggets-pickInfo">
          <span className="resultNuggets-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultNuggets-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultNuggets-pickDetails">
        <div className="resultNuggets-pickTeam">
          <span className="resultNuggets-teamLabel">От:</span>
          <span className="resultNuggets-teamName" title={pick.originalTeam}>
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
        className={`resultNuggets-tradeSection resultNuggets-tradeSection--${type}`}
      >
        <div className="resultNuggets-sectionHeader">
          <div className="resultNuggets-sectionTitle">{title}</div>
          <div className="resultNuggets-sectionCounts">
            {hasPlayers && (
              <span className="resultNuggets-countBadge resultNuggets-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultNuggets-countBadge resultNuggets-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultNuggets-sectionContent resultNuggets-sectionContent--players">
            <div className="resultNuggets-contentLabel">Игроки:</div>
            <div className="resultNuggets-cardsGrid">
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
          <div className="resultNuggets-sectionContent resultNuggets-sectionContent--picks">
            <div className="resultNuggets-contentLabel">Драфт-пики:</div>
            <div className="resultNuggets-cardsGrid">
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
    const isTeam1Nuggets = team1Name === "Denver Nuggets";
    const isTeam2Nuggets = team2Name === "Denver Nuggets";

    return (
      <div className="resultNuggets-tradeData">
        <div className="resultNuggets-tradeSummary">
          <div className="resultNuggets-summaryStats">
            <div className="resultNuggets-statItem">
              <div className="resultNuggets-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultNuggets-statLabel">
                активов от {isTeam2Nuggets ? "Denver Nuggets" : team2Name}
              </div>
            </div>
            <div className="resultNuggets-exchangeArrow">⇄</div>
            <div className="resultNuggets-statItem">
              <div className="resultNuggets-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultNuggets-statLabel">
                активов от {isTeam1Nuggets ? "Denver Nuggets" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultNuggets-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultNuggets-tradeDivider">
            <div className="resultNuggets-dividerLine"></div>
            <div className="resultNuggets-dividerText">Обмен</div>
            <div className="resultNuggets-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultNuggets-tradeNote">
            <div className="resultNuggets-noteHeader">
              <span className="resultNuggets-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultNuggets-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultNuggets-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultNuggets-tradeActions">
          <button
            className="resultNuggets-actionButton resultNuggets-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultNuggets-actionButton resultNuggets-actionButton--reject"
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
    <div className="resultNuggets-container">
      <div className="resultNuggets-controls">
        <button
          className={`resultNuggets-button ${
            notificationCount > 0
              ? "resultNuggets-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultNuggets-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultNuggets-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultNuggets-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultNuggets-modalOverlay" onClick={closeModal}>
          <div
            className="resultNuggets-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultNuggets-modalHeader">
              <div className="resultNuggets-headerContent">
                <div className="resultNuggets-teamLogo"></div>
                <div className="resultNuggets-headerInfo">
                  <h2>Трейды Denver Nuggets</h2>
                  <div className="resultNuggets-headerSubtitle">
                    <span className="resultNuggets-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultNuggets-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultNuggets-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultNuggets-modalContent">
              {trades.length === 0 ? (
                <div className="resultNuggets-noTrades">
                  <div className="resultNuggets-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultNuggets-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultNuggets-tradeItem"
                    >
                      <div className="resultNuggets-tradeHeader">
                        <div className="resultNuggets-tradeMeta">
                          <span className="resultNuggets-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultNuggets-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultNuggets-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultNuggets-modalFooter">
              <button
                className="resultNuggets-closeAllButton"
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

export default TradeResultNuggets;
