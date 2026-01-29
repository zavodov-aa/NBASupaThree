import React, { useState, useEffect } from "react";
import "./tradeResultSpurs.css";
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

const TradeResultSpurs: React.FC = () => {
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
        .eq("trade_team", "San Antonio Spurs")
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
        setError("Нет доступных трейдов для San Antonio Spurs");
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
          .eq("trade_team", "San Antonio Spurs")
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
    <div className={`resultSpurs-playerCard resultSpurs-playerCard--${type}`}>
      <div className="resultSpurs-playerHeader">
        <div className="resultSpurs-playerNameSection">
          <span className="resultSpurs-playerName">{player.name}</span>
        </div>
        <span className="resultSpurs-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultSpurs-draftPickCard">
      <div className="resultSpurs-pickHeader">
        <div className="resultSpurs-pickInfo">
          <span className="resultSpurs-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultSpurs-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultSpurs-pickDetails">
        <div className="resultSpurs-pickTeam">
          <span className="resultSpurs-teamLabel">От:</span>
          <span className="resultSpurs-teamName" title={pick.originalTeam}>
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
        className={`resultSpurs-tradeSection resultSpurs-tradeSection--${type}`}
      >
        <div className="resultSpurs-sectionHeader">
          <div className="resultSpurs-sectionTitle">{title}</div>
          <div className="resultSpurs-sectionCounts">
            {hasPlayers && (
              <span className="resultSpurs-countBadge resultSpurs-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultSpurs-countBadge resultSpurs-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultSpurs-sectionContent resultSpurs-sectionContent--players">
            <div className="resultSpurs-contentLabel">Игроки:</div>
            <div className="resultSpurs-cardsGrid">
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
          <div className="resultSpurs-sectionContent resultSpurs-sectionContent--picks">
            <div className="resultSpurs-contentLabel">Драфт-пики:</div>
            <div className="resultSpurs-cardsGrid">
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
    const isTeam1Spurs = team1Name === "San Antonio Spurs";
    const isTeam2Spurs = team2Name === "San Antonio Spurs";

    return (
      <div className="resultSpurs-tradeData">
        <div className="resultSpurs-tradeSummary">
          <div className="resultSpurs-summaryStats">
            <div className="resultSpurs-statItem">
              <div className="resultSpurs-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultSpurs-statLabel">
                активов от {isTeam2Spurs ? "San Antonio Spurs" : team2Name}
              </div>
            </div>
            <div className="resultSpurs-exchangeArrow">⇄</div>
            <div className="resultSpurs-statItem">
              <div className="resultSpurs-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultSpurs-statLabel">
                активов от {isTeam1Spurs ? "San Antonio Spurs" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultSpurs-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultSpurs-tradeDivider">
            <div className="resultSpurs-dividerLine"></div>
            <div className="resultSpurs-dividerText">Обмен</div>
            <div className="resultSpurs-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultSpurs-tradeNote">
            <div className="resultSpurs-noteHeader">
              <span className="resultSpurs-noteTitle">Примечание к трейду</span>
              <span className="resultSpurs-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultSpurs-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultSpurs-tradeActions">
          <button
            className="resultSpurs-actionButton resultSpurs-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultSpurs-actionButton resultSpurs-actionButton--reject"
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
    <div className="resultSpurs-container">
      <div className="resultSpurs-controls">
        <button
          className={`resultSpurs-button ${
            notificationCount > 0 ? "resultSpurs-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultSpurs-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultSpurs-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultSpurs-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultSpurs-modalOverlay" onClick={closeModal}>
          <div
            className="resultSpurs-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultSpurs-modalHeader">
              <div className="resultSpurs-headerContent">
                <div className="resultSpurs-teamLogo"></div>
                <div className="resultSpurs-headerInfo">
                  <h2>Трейды San Antonio Spurs</h2>
                  <div className="resultSpurs-headerSubtitle">
                    <span className="resultSpurs-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultSpurs-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultSpurs-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultSpurs-modalContent">
              {trades.length === 0 ? (
                <div className="resultSpurs-noTrades">
                  <div className="resultSpurs-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultSpurs-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultSpurs-tradeItem"
                    >
                      <div className="resultSpurs-tradeHeader">
                        <div className="resultSpurs-tradeMeta">
                          <span className="resultSpurs-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultSpurs-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultSpurs-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultSpurs-modalFooter">
              <button
                className="resultSpurs-closeAllButton"
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

export default TradeResultSpurs;
