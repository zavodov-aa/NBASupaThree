import React, { useState, useEffect } from "react";
import "./tradeResultHornets.css";
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

const TradeResultHornets: React.FC = () => {
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
        .eq("trade_team", "Charlotte Hornets")
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
        setError("Нет доступных трейдов для Charlotte Hornets");
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
          .eq("trade_team", "Charlotte Hornets")
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
      className={`resultHornets-playerCard resultHornets-playerCard--${type}`}
    >
      <div className="resultHornets-playerHeader">
        <div className="resultHornets-playerNameSection">
          <span className="resultHornets-playerName">{player.name}</span>
        </div>
        <span className="resultHornets-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultHornets-draftPickCard">
      <div className="resultHornets-pickHeader">
        <div className="resultHornets-pickInfo">
          <span className="resultHornets-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultHornets-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultHornets-pickDetails">
        <div className="resultHornets-pickTeam">
          <span className="resultHornets-teamLabel">От:</span>
          <span className="resultHornets-teamName" title={pick.originalTeam}>
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
        className={`resultHornets-tradeSection resultHornets-tradeSection--${type}`}
      >
        <div className="resultHornets-sectionHeader">
          <div className="resultHornets-sectionTitle">{title}</div>
          <div className="resultHornets-sectionCounts">
            {hasPlayers && (
              <span className="resultHornets-countBadge resultHornets-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultHornets-countBadge resultHornets-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultHornets-sectionContent resultHornets-sectionContent--players">
            <div className="resultHornets-contentLabel">Игроки:</div>
            <div className="resultHornets-cardsGrid">
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
          <div className="resultHornets-sectionContent resultHornets-sectionContent--picks">
            <div className="resultHornets-contentLabel">Драфт-пики:</div>
            <div className="resultHornets-cardsGrid">
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
    const isTeam1Hornets = team1Name === "Charlotte Hornets";
    const isTeam2Hornets = team2Name === "Charlotte Hornets";

    return (
      <div className="resultHornets-tradeData">
        <div className="resultHornets-tradeSummary">
          <div className="resultHornets-summaryStats">
            <div className="resultHornets-statItem">
              <div className="resultHornets-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultHornets-statLabel">
                активов от {isTeam2Hornets ? "Charlotte Hornets" : team2Name}
              </div>
            </div>
            <div className="resultHornets-exchangeArrow">⇄</div>
            <div className="resultHornets-statItem">
              <div className="resultHornets-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultHornets-statLabel">
                активов от {isTeam1Hornets ? "Charlotte Hornets" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultHornets-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultHornets-tradeDivider">
            <div className="resultHornets-dividerLine"></div>
            <div className="resultHornets-dividerText">Обмен</div>
            <div className="resultHornets-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultHornets-tradeNote">
            <div className="resultHornets-noteHeader">
              <span className="resultHornets-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultHornets-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultHornets-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultHornets-tradeActions">
          <button
            className="resultHornets-actionButton resultHornets-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultHornets-actionButton resultHornets-actionButton--reject"
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
    <div className="resultHornets-container">
      <div className="resultHornets-controls">
        <button
          className={`resultHornets-button ${
            notificationCount > 0
              ? "resultHornets-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultHornets-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultHornets-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultHornets-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultHornets-modalOverlay" onClick={closeModal}>
          <div
            className="resultHornets-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultHornets-modalHeader">
              <div className="resultHornets-headerContent">
                <div className="resultHornets-teamLogo"></div>
                <div className="resultHornets-headerInfo">
                  <h2>Трейды Charlotte Hornets</h2>
                  <div className="resultHornets-headerSubtitle">
                    <span className="resultHornets-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultHornets-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultHornets-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultHornets-modalContent">
              {trades.length === 0 ? (
                <div className="resultHornets-noTrades">
                  <div className="resultHornets-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultHornets-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultHornets-tradeItem"
                    >
                      <div className="resultHornets-tradeHeader">
                        <div className="resultHornets-tradeMeta">
                          <span className="resultHornets-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultHornets-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultHornets-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultHornets-modalFooter">
              <button
                className="resultHornets-closeAllButton"
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

export default TradeResultHornets;
