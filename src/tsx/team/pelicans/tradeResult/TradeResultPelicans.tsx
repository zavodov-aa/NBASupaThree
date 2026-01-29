import React, { useState, useEffect } from "react";
import "./tradeResultPelicans.css";
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

const TradeResultPelicans: React.FC = () => {
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
        .eq("trade_team", "New Orleans Pelicans")
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
        setError("Нет доступных трейдов для New Orleans Pelicans");
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
          .eq("trade_team", "New Orleans Pelicans")
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
      className={`resultPelicans-playerCard resultPelicans-playerCard--${type}`}
    >
      <div className="resultPelicans-playerHeader">
        <div className="resultPelicans-playerNameSection">
          <span className="resultPelicans-playerName">{player.name}</span>
        </div>
        <span className="resultPelicans-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultPelicans-draftPickCard">
      <div className="resultPelicans-pickHeader">
        <div className="resultPelicans-pickInfo">
          <span className="resultPelicans-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultPelicans-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultPelicans-pickDetails">
        <div className="resultPelicans-pickTeam">
          <span className="resultPelicans-teamLabel">От:</span>
          <span className="resultPelicans-teamName" title={pick.originalTeam}>
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
        className={`resultPelicans-tradeSection resultPelicans-tradeSection--${type}`}
      >
        <div className="resultPelicans-sectionHeader">
          <div className="resultPelicans-sectionTitle">{title}</div>
          <div className="resultPelicans-sectionCounts">
            {hasPlayers && (
              <span className="resultPelicans-countBadge resultPelicans-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultPelicans-countBadge resultPelicans-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultPelicans-sectionContent resultPelicans-sectionContent--players">
            <div className="resultPelicans-contentLabel">Игроки:</div>
            <div className="resultPelicans-cardsGrid">
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
          <div className="resultPelicans-sectionContent resultPelicans-sectionContent--picks">
            <div className="resultPelicans-contentLabel">Драфт-пики:</div>
            <div className="resultPelicans-cardsGrid">
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
    const isTeam1Pelicans = team1Name === "New Orleans Pelicans";
    const isTeam2Pelicans = team2Name === "New Orleans Pelicans";

    return (
      <div className="resultPelicans-tradeData">
        <div className="resultPelicans-tradeSummary">
          <div className="resultPelicans-summaryStats">
            <div className="resultPelicans-statItem">
              <div className="resultPelicans-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultPelicans-statLabel">
                активов от{" "}
                {isTeam2Pelicans ? "New Orleans Pelicans" : team2Name}
              </div>
            </div>
            <div className="resultPelicans-exchangeArrow">⇄</div>
            <div className="resultPelicans-statItem">
              <div className="resultPelicans-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultPelicans-statLabel">
                активов от{" "}
                {isTeam1Pelicans ? "New Orleans Pelicans" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultPelicans-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultPelicans-tradeDivider">
            <div className="resultPelicans-dividerLine"></div>
            <div className="resultPelicans-dividerText">Обмен</div>
            <div className="resultPelicans-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultPelicans-tradeNote">
            <div className="resultPelicans-noteHeader">
              <span className="resultPelicans-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultPelicans-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultPelicans-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultPelicans-tradeActions">
          <button
            className="resultPelicans-actionButton resultPelicans-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultPelicans-actionButton resultPelicans-actionButton--reject"
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
    <div className="resultPelicans-container">
      <div className="resultPelicans-controls">
        <button
          className={`resultPelicans-button ${
            notificationCount > 0
              ? "resultPelicans-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultPelicans-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultPelicans-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultPelicans-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultPelicans-modalOverlay" onClick={closeModal}>
          <div
            className="resultPelicans-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultPelicans-modalHeader">
              <div className="resultPelicans-headerContent">
                <div className="resultPelicans-teamLogo"></div>
                <div className="resultPelicans-headerInfo">
                  <h2>Трейды New Orleans Pelicans</h2>
                  <div className="resultPelicans-headerSubtitle">
                    <span className="resultPelicans-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultPelicans-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="resultPelicans-closeModal"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="resultPelicans-modalContent">
              {trades.length === 0 ? (
                <div className="resultPelicans-noTrades">
                  <div className="resultPelicans-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultPelicans-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultPelicans-tradeItem"
                    >
                      <div className="resultPelicans-tradeHeader">
                        <div className="resultPelicans-tradeMeta">
                          <span className="resultPelicans-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultPelicans-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultPelicans-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultPelicans-modalFooter">
              <button
                className="resultPelicans-closeAllButton"
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

export default TradeResultPelicans;
