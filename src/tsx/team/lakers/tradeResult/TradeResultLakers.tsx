import React, { useState, useEffect } from "react";
import "./tradeResultLakers.css";
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

const TradeResultLakers: React.FC = () => {
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
        .eq("trade_team", "Los Angeles Lakers")
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
        setError("Нет доступных трейдов для Los Angeles Lakers");
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
          .eq("trade_team", "Los Angeles Lakers")
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
    <div className={`resultLakers-playerCard resultLakers-playerCard--${type}`}>
      <div className="resultLakers-playerHeader">
        <div className="resultLakers-playerNameSection">
          <span className="resultLakers-playerName">{player.name}</span>
        </div>
        <span className="resultLakers-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultLakers-draftPickCard">
      <div className="resultLakers-pickHeader">
        <div className="resultLakers-pickInfo">
          <span className="resultLakers-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultLakers-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultLakers-pickDetails">
        <div className="resultLakers-pickTeam">
          <span className="resultLakers-teamLabel">От:</span>
          <span className="resultLakers-teamName" title={pick.originalTeam}>
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
        className={`resultLakers-tradeSection resultLakers-tradeSection--${type}`}
      >
        <div className="resultLakers-sectionHeader">
          <div className="resultLakers-sectionTitle">{title}</div>
          <div className="resultLakers-sectionCounts">
            {hasPlayers && (
              <span className="resultLakers-countBadge resultLakers-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultLakers-countBadge resultLakers-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultLakers-sectionContent resultLakers-sectionContent--players">
            <div className="resultLakers-contentLabel">Игроки:</div>
            <div className="resultLakers-cardsGrid">
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
          <div className="resultLakers-sectionContent resultLakers-sectionContent--picks">
            <div className="resultLakers-contentLabel">Драфт-пики:</div>
            <div className="resultLakers-cardsGrid">
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
    const isTeam1Lakers = team1Name === "Los Angeles Lakers";
    const isTeam2Lakers = team2Name === "Los Angeles Lakers";

    return (
      <div className="resultLakers-tradeData">
        <div className="resultLakers-tradeSummary">
          <div className="resultLakers-summaryStats">
            <div className="resultLakers-statItem">
              <div className="resultLakers-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultLakers-statLabel">
                активов от {isTeam2Lakers ? "Los Angeles Lakers" : team2Name}
              </div>
            </div>
            <div className="resultLakers-exchangeArrow">⇄</div>
            <div className="resultLakers-statItem">
              <div className="resultLakers-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultLakers-statLabel">
                активов от {isTeam1Lakers ? "Los Angeles Lakers" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultLakers-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultLakers-tradeDivider">
            <div className="resultLakers-dividerLine"></div>
            <div className="resultLakers-dividerText">Обмен</div>
            <div className="resultLakers-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultLakers-tradeNote">
            <div className="resultLakers-noteHeader">
              <span className="resultLakers-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultLakers-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultLakers-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultLakers-tradeActions">
          <button
            className="resultLakers-actionButton resultLakers-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultLakers-actionButton resultLakers-actionButton--reject"
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
    <div className="resultLakers-container">
      <div className="resultLakers-controls">
        <button
          className={`resultLakers-button ${
            notificationCount > 0 ? "resultLakers-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultLakers-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultLakers-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultLakers-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultLakers-modalOverlay" onClick={closeModal}>
          <div
            className="resultLakers-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultLakers-modalHeader">
              <div className="resultLakers-headerContent">
                <div className="resultLakers-teamLogo"></div>
                <div className="resultLakers-headerInfo">
                  <h2>Трейды Los Angeles Lakers</h2>
                  <div className="resultLakers-headerSubtitle">
                    <span className="resultLakers-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultLakers-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultLakers-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultLakers-modalContent">
              {trades.length === 0 ? (
                <div className="resultLakers-noTrades">
                  <div className="resultLakers-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultLakers-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultLakers-tradeItem"
                    >
                      <div className="resultLakers-tradeHeader">
                        <div className="resultLakers-tradeMeta">
                          <span className="resultLakers-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultLakers-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultLakers-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultLakers-modalFooter">
              <button
                className="resultLakers-closeAllButton"
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

export default TradeResultLakers;
