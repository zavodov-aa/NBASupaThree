import React, { useState, useEffect } from "react";
import "./tradeResultTimberwolves.css";
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

const TradeResultTimberwolves: React.FC = () => {
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
        .eq("trade_team", "Minnesota Timberwolves")
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
        setError("Нет доступных трейдов для Minnesota Timberwolves");
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
          .eq("trade_team", "Minnesota Timberwolves")
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
      className={`resultTimberwolves-playerCard resultTimberwolves-playerCard--${type}`}
    >
      <div className="resultTimberwolves-playerHeader">
        <div className="resultTimberwolves-playerNameSection">
          <span className="resultTimberwolves-playerName">{player.name}</span>
        </div>
        <span className="resultTimberwolves-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultTimberwolves-draftPickCard">
      <div className="resultTimberwolves-pickHeader">
        <div className="resultTimberwolves-pickInfo">
          <span className="resultTimberwolves-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultTimberwolves-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultTimberwolves-pickDetails">
        <div className="resultTimberwolves-pickTeam">
          <span className="resultTimberwolves-teamLabel">От:</span>
          <span
            className="resultTimberwolves-teamName"
            title={pick.originalTeam}
          >
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
        className={`resultTimberwolves-tradeSection resultTimberwolves-tradeSection--${type}`}
      >
        <div className="resultTimberwolves-sectionHeader">
          <div className="resultTimberwolves-sectionTitle">{title}</div>
          <div className="resultTimberwolves-sectionCounts">
            {hasPlayers && (
              <span className="resultTimberwolves-countBadge resultTimberwolves-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultTimberwolves-countBadge resultTimberwolves-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultTimberwolves-sectionContent resultTimberwolves-sectionContent--players">
            <div className="resultTimberwolves-contentLabel">Игроки:</div>
            <div className="resultTimberwolves-cardsGrid">
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
          <div className="resultTimberwolves-sectionContent resultTimberwolves-sectionContent--picks">
            <div className="resultTimberwolves-contentLabel">Драфт-пики:</div>
            <div className="resultTimberwolves-cardsGrid">
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
    const isTeam1Timberwolves = team1Name === "Minnesota Timberwolves";
    const isTeam2Timberwolves = team2Name === "Minnesota Timberwolves";

    return (
      <div className="resultTimberwolves-tradeData">
        <div className="resultTimberwolves-tradeSummary">
          <div className="resultTimberwolves-summaryStats">
            <div className="resultTimberwolves-statItem">
              <div className="resultTimberwolves-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultTimberwolves-statLabel">
                активов от{" "}
                {isTeam2Timberwolves ? "Minnesota Timberwolves" : team2Name}
              </div>
            </div>
            <div className="resultTimberwolves-exchangeArrow">⇄</div>
            <div className="resultTimberwolves-statItem">
              <div className="resultTimberwolves-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultTimberwolves-statLabel">
                активов от{" "}
                {isTeam1Timberwolves ? "Minnesota Timberwolves" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultTimberwolves-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultTimberwolves-tradeDivider">
            <div className="resultTimberwolves-dividerLine"></div>
            <div className="resultTimberwolves-dividerText">Обмен</div>
            <div className="resultTimberwolves-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultTimberwolves-tradeNote">
            <div className="resultTimberwolves-noteHeader">
              <span className="resultTimberwolves-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultTimberwolves-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultTimberwolves-noteContent">
              {data.tradeNote}
            </div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultTimberwolves-tradeActions">
          <button
            className="resultTimberwolves-actionButton resultTimberwolves-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultTimberwolves-actionButton resultTimberwolves-actionButton--reject"
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
    <div className="resultTimberwolves-container">
      <div className="resultTimberwolves-controls">
        <button
          className={`resultTimberwolves-button ${
            notificationCount > 0
              ? "resultTimberwolves-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultTimberwolves-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultTimberwolves-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultTimberwolves-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultTimberwolves-modalOverlay" onClick={closeModal}>
          <div
            className="resultTimberwolves-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultTimberwolves-modalHeader">
              <div className="resultTimberwolves-headerContent">
                <div className="resultTimberwolves-teamLogo"></div>
                <div className="resultTimberwolves-headerInfo">
                  <h2>Трейды Minnesota Timberwolves</h2>
                  <div className="resultTimberwolves-headerSubtitle">
                    <span className="resultTimberwolves-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultTimberwolves-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="resultTimberwolves-closeModal"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="resultTimberwolves-modalContent">
              {trades.length === 0 ? (
                <div className="resultTimberwolves-noTrades">
                  <div className="resultTimberwolves-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultTimberwolves-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultTimberwolves-tradeItem"
                    >
                      <div className="resultTimberwolves-tradeHeader">
                        <div className="resultTimberwolves-tradeMeta">
                          <span className="resultTimberwolves-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultTimberwolves-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultTimberwolves-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultTimberwolves-modalFooter">
              <button
                className="resultTimberwolves-closeAllButton"
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

export default TradeResultTimberwolves;
