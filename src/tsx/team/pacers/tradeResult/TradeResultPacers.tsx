import React, { useState, useEffect } from "react";
import "./tradeResultPacers.css";
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

const TradeResultPacers: React.FC = () => {
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
        .eq("trade_team", "Indiana Pacers")
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
        setError("Нет доступных трейдов для Indiana Pacers");
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
          .eq("trade_team", "Indiana Pacers")
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
    <div className={`resultPacers-playerCard resultPacers-playerCard--${type}`}>
      <div className="resultPacers-playerHeader">
        <div className="resultPacers-playerNameSection">
          <span className="resultPacers-playerName">{player.name}</span>
        </div>
        <span className="resultPacers-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultPacers-draftPickCard">
      <div className="resultPacers-pickHeader">
        <div className="resultPacers-pickInfo">
          <span className="resultPacers-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultPacers-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultPacers-pickDetails">
        <div className="resultPacers-pickTeam">
          <span className="resultPacers-teamLabel">От:</span>
          <span className="resultPacers-teamName" title={pick.originalTeam}>
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
        className={`resultPacers-tradeSection resultPacers-tradeSection--${type}`}
      >
        <div className="resultPacers-sectionHeader">
          <div className="resultPacers-sectionTitle">{title}</div>
          <div className="resultPacers-sectionCounts">
            {hasPlayers && (
              <span className="resultPacers-countBadge resultPacers-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultPacers-countBadge resultPacers-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultPacers-sectionContent resultPacers-sectionContent--players">
            <div className="resultPacers-contentLabel">Игроки:</div>
            <div className="resultPacers-cardsGrid">
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
          <div className="resultPacers-sectionContent resultPacers-sectionContent--picks">
            <div className="resultPacers-contentLabel">Драфт-пики:</div>
            <div className="resultPacers-cardsGrid">
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
    const isTeam1Pacers = team1Name === "Indiana Pacers";
    const isTeam2Pacers = team2Name === "Indiana Pacers";

    return (
      <div className="resultPacers-tradeData">
        <div className="resultPacers-tradeSummary">
          <div className="resultPacers-summaryStats">
            <div className="resultPacers-statItem">
              <div className="resultPacers-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultPacers-statLabel">
                активов от {isTeam2Pacers ? "Indiana Pacers" : team2Name}
              </div>
            </div>
            <div className="resultPacers-exchangeArrow">⇄</div>
            <div className="resultPacers-statItem">
              <div className="resultPacers-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultPacers-statLabel">
                активов от {isTeam1Pacers ? "Indiana Pacers" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultPacers-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultPacers-tradeDivider">
            <div className="resultPacers-dividerLine"></div>
            <div className="resultPacers-dividerText">Обмен</div>
            <div className="resultPacers-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultPacers-tradeNote">
            <div className="resultPacers-noteHeader">
              <span className="resultPacers-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultPacers-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultPacers-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultPacers-tradeActions">
          <button
            className="resultPacers-actionButton resultPacers-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultPacers-actionButton resultPacers-actionButton--reject"
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
    <div className="resultPacers-container">
      <div className="resultPacers-controls">
        <button
          className={`resultPacers-button ${
            notificationCount > 0 ? "resultPacers-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultPacers-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultPacers-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultPacers-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultPacers-modalOverlay" onClick={closeModal}>
          <div
            className="resultPacers-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultPacers-modalHeader">
              <div className="resultPacers-headerContent">
                <div className="resultPacers-teamLogo"></div>
                <div className="resultPacers-headerInfo">
                  <h2>Трейды Indiana Pacers</h2>
                  <div className="resultPacers-headerSubtitle">
                    <span className="resultPacers-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultPacers-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultPacers-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultPacers-modalContent">
              {trades.length === 0 ? (
                <div className="resultPacers-noTrades">
                  <div className="resultPacers-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultPacers-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultPacers-tradeItem"
                    >
                      <div className="resultPacers-tradeHeader">
                        <div className="resultPacers-tradeMeta">
                          <span className="resultPacers-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultPacers-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultPacers-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultPacers-modalFooter">
              <button
                className="resultPacers-closeAllButton"
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

export default TradeResultPacers;
