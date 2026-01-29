import React, { useState, useEffect } from "react";
import "./tradeResultGrizzlies.css";
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

const TradeResultGrizzlies: React.FC = () => {
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
        .eq("trade_team", "Memphis Grizzlies")
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
        setError("Нет доступных трейдов для Memphis Grizzlies");
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
          .eq("trade_team", "Memphis Grizzlies")
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
      className={`resultGrizzlies-playerCard resultGrizzlies-playerCard--${type}`}
    >
      <div className="resultGrizzlies-playerHeader">
        <div className="resultGrizzlies-playerNameSection">
          <span className="resultGrizzlies-playerName">{player.name}</span>
        </div>
        <span className="resultGrizzlies-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultGrizzlies-draftPickCard">
      <div className="resultGrizzlies-pickHeader">
        <div className="resultGrizzlies-pickInfo">
          <span className="resultGrizzlies-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultGrizzlies-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultGrizzlies-pickDetails">
        <div className="resultGrizzlies-pickTeam">
          <span className="resultGrizzlies-teamLabel">От:</span>
          <span className="resultGrizzlies-teamName" title={pick.originalTeam}>
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
        className={`resultGrizzlies-tradeSection resultGrizzlies-tradeSection--${type}`}
      >
        <div className="resultGrizzlies-sectionHeader">
          <div className="resultGrizzlies-sectionTitle">{title}</div>
          <div className="resultGrizzlies-sectionCounts">
            {hasPlayers && (
              <span className="resultGrizzlies-countBadge resultGrizzlies-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultGrizzlies-countBadge resultGrizzlies-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultGrizzlies-sectionContent resultGrizzlies-sectionContent--players">
            <div className="resultGrizzlies-contentLabel">Игроки:</div>
            <div className="resultGrizzlies-cardsGrid">
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
          <div className="resultGrizzlies-sectionContent resultGrizzlies-sectionContent--picks">
            <div className="resultGrizzlies-contentLabel">Драфт-пики:</div>
            <div className="resultGrizzlies-cardsGrid">
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
    const isTeam1Grizzlies = team1Name === "Memphis Grizzlies";
    const isTeam2Grizzlies = team2Name === "Memphis Grizzlies";

    return (
      <div className="resultGrizzlies-tradeData">
        <div className="resultGrizzlies-tradeSummary">
          <div className="resultGrizzlies-summaryStats">
            <div className="resultGrizzlies-statItem">
              <div className="resultGrizzlies-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultGrizzlies-statLabel">
                активов от {isTeam2Grizzlies ? "Memphis Grizzlies" : team2Name}
              </div>
            </div>
            <div className="resultGrizzlies-exchangeArrow">⇄</div>
            <div className="resultGrizzlies-statItem">
              <div className="resultGrizzlies-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultGrizzlies-statLabel">
                активов от {isTeam1Grizzlies ? "Memphis Grizzlies" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultGrizzlies-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultGrizzlies-tradeDivider">
            <div className="resultGrizzlies-dividerLine"></div>
            <div className="resultGrizzlies-dividerText">Обмен</div>
            <div className="resultGrizzlies-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultGrizzlies-tradeNote">
            <div className="resultGrizzlies-noteHeader">
              <span className="resultGrizzlies-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultGrizzlies-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultGrizzlies-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultGrizzlies-tradeActions">
          <button
            className="resultGrizzlies-actionButton resultGrizzlies-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultGrizzlies-actionButton resultGrizzlies-actionButton--reject"
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
    <div className="resultGrizzlies-container">
      <div className="resultGrizzlies-controls">
        <button
          className={`resultGrizzlies-button ${
            notificationCount > 0
              ? "resultGrizzlies-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultGrizzlies-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultGrizzlies-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultGrizzlies-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultGrizzlies-modalOverlay" onClick={closeModal}>
          <div
            className="resultGrizzlies-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultGrizzlies-modalHeader">
              <div className="resultGrizzlies-headerContent">
                <div className="resultGrizzlies-teamLogo"></div>
                <div className="resultGrizzlies-headerInfo">
                  <h2>Трейды Memphis Grizzlies</h2>
                  <div className="resultGrizzlies-headerSubtitle">
                    <span className="resultGrizzlies-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultGrizzlies-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="resultGrizzlies-closeModal"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="resultGrizzlies-modalContent">
              {trades.length === 0 ? (
                <div className="resultGrizzlies-noTrades">
                  <div className="resultGrizzlies-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultGrizzlies-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultGrizzlies-tradeItem"
                    >
                      <div className="resultGrizzlies-tradeHeader">
                        <div className="resultGrizzlies-tradeMeta">
                          <span className="resultGrizzlies-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultGrizzlies-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultGrizzlies-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultGrizzlies-modalFooter">
              <button
                className="resultGrizzlies-closeAllButton"
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

export default TradeResultGrizzlies;
