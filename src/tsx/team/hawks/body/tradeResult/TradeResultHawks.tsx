import React, { useState, useEffect } from "react";
import "./tradeResultHawks.css";
import { supabase } from "../../../../../Supabase";

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

const TradeResultHawks: React.FC = () => {
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
        .eq("trade_team", "Atlanta Hawks")
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
        setError("Нет доступных трейдов для Atlanta Hawks");
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
          .eq("trade_team", "Atlanta Hawks")
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
    <div className={`resultHawks-playerCard resultHawks-playerCard--${type}`}>
      <div className="resultHawks-playerHeader">
        <div className="resultHawks-playerNameSection">
          <span className="resultHawks-playerName">{player.name}</span>
        </div>
        <span className="resultHawks-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultHawks-draftPickCard">
      <div className="resultHawks-pickHeader">
        <div className="resultHawks-pickInfo">
          <span className="resultHawks-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultHawks-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultHawks-pickDetails">
        <div className="resultHawks-pickTeam">
          <span className="resultHawks-teamLabel">От:</span>
          <span className="resultHawks-teamName" title={pick.originalTeam}>
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
        className={`resultHawks-tradeSection resultHawks-tradeSection--${type}`}
      >
        <div className="resultHawks-sectionHeader">
          <div className="resultHawks-sectionTitle">{title}</div>
          <div className="resultHawks-sectionCounts">
            {hasPlayers && (
              <span className="resultHawks-countBadge resultHawks-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultHawks-countBadge resultHawks-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultHawks-sectionContent resultHawks-sectionContent--players">
            <div className="resultHawks-contentLabel">Игроки:</div>
            <div className="resultHawks-cardsGrid">
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
          <div className="resultHawks-sectionContent resultHawks-sectionContent--picks">
            <div className="resultHawks-contentLabel">Драфт-пики:</div>
            <div className="resultHawks-cardsGrid">
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
    const isTeam1Hawks = team1Name === "Atlanta Hawks";
    const isTeam2Hawks = team2Name === "Atlanta Hawks";

    return (
      <div className="resultHawks-tradeData">
        <div className="resultHawks-tradeSummary">
          <div className="resultHawks-summaryStats">
            <div className="resultHawks-statItem">
              <div className="resultHawks-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultHawks-statLabel">
                активов от {isTeam2Hawks ? "Atlanta Hawks" : team2Name}
              </div>
            </div>
            <div className="resultHawks-exchangeArrow">⇄</div>
            <div className="resultHawks-statItem">
              <div className="resultHawks-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultHawks-statLabel">
                активов от {isTeam1Hawks ? "Atlanta Hawks" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultHawks-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultHawks-tradeDivider">
            <div className="resultHawks-dividerLine"></div>
            <div className="resultHawks-dividerText">Обмен</div>
            <div className="resultHawks-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultHawks-tradeNote">
            <div className="resultHawks-noteHeader">
              <span className="resultHawks-noteTitle">Примечание к трейду</span>
              <span className="resultHawks-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultHawks-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultHawks-tradeActions">
          <button
            className="resultHawks-actionButton resultHawks-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultHawks-actionButton resultHawks-actionButton--reject"
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
    <div className="resultHawks-container">
      <div className="resultHawks-controls">
        <button
          className={`resultHawks-button ${
            notificationCount > 0 ? "resultHawks-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultHawks-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultHawks-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultHawks-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultHawks-modalOverlay" onClick={closeModal}>
          <div
            className="resultHawks-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultHawks-modalHeader">
              <div className="resultHawks-headerContent">
                <div className="resultHawks-teamLogo"></div>
                <div className="resultHawks-headerInfo">
                  <h2>Трейды Atlanta Hawks</h2>
                  <div className="resultHawks-headerSubtitle">
                    <span className="resultHawks-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultHawks-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultHawks-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultHawks-modalContent">
              {trades.length === 0 ? (
                <div className="resultHawks-noTrades">
                  <div className="resultHawks-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultHawks-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultHawks-tradeItem"
                    >
                      <div className="resultHawks-tradeHeader">
                        <div className="resultHawks-tradeMeta">
                          <span className="resultHawks-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultHawks-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultHawks-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultHawks-modalFooter">
              <button
                className="resultHawks-closeAllButton"
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

export default TradeResultHawks;
