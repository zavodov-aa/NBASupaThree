import React, { useState, useEffect } from "react";
import "./tradeResultWarriors.css";
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

const TradeResultWarriors: React.FC = () => {
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
        .eq("trade_team", "Golden State Warriors")
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
        setError("Нет доступных трейдов для Golden State Warriors");
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
          .eq("trade_team", "Golden State Warriors")
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
      className={`resultWarriors-playerCard resultWarriors-playerCard--${type}`}
    >
      <div className="resultWarriors-playerHeader">
        <div className="resultWarriors-playerNameSection">
          <span className="resultWarriors-playerName">{player.name}</span>
        </div>
        <span className="resultWarriors-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultWarriors-draftPickCard">
      <div className="resultWarriors-pickHeader">
        <div className="resultWarriors-pickInfo">
          <span className="resultWarriors-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultWarriors-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultWarriors-pickDetails">
        <div className="resultWarriors-pickTeam">
          <span className="resultWarriors-teamLabel">От:</span>
          <span className="resultWarriors-teamName" title={pick.originalTeam}>
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
        className={`resultWarriors-tradeSection resultWarriors-tradeSection--${type}`}
      >
        <div className="resultWarriors-sectionHeader">
          <div className="resultWarriors-sectionTitle">{title}</div>
          <div className="resultWarriors-sectionCounts">
            {hasPlayers && (
              <span className="resultWarriors-countBadge resultWarriors-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultWarriors-countBadge resultWarriors-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultWarriors-sectionContent resultWarriors-sectionContent--players">
            <div className="resultWarriors-contentLabel">Игроки:</div>
            <div className="resultWarriors-cardsGrid">
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
          <div className="resultWarriors-sectionContent resultWarriors-sectionContent--picks">
            <div className="resultWarriors-contentLabel">Драфт-пики:</div>
            <div className="resultWarriors-cardsGrid">
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
    const isTeam1Warriors = team1Name === "Golden State Warriors";
    const isTeam2Warriors = team2Name === "Golden State Warriors";

    return (
      <div className="resultWarriors-tradeData">
        <div className="resultWarriors-tradeSummary">
          <div className="resultWarriors-summaryStats">
            <div className="resultWarriors-statItem">
              <div className="resultWarriors-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultWarriors-statLabel">
                активов от{" "}
                {isTeam2Warriors ? "Golden State Warriors" : team2Name}
              </div>
            </div>
            <div className="resultWarriors-exchangeArrow">⇄</div>
            <div className="resultWarriors-statItem">
              <div className="resultWarriors-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultWarriors-statLabel">
                активов от{" "}
                {isTeam1Warriors ? "Golden State Warriors" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultWarriors-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultWarriors-tradeDivider">
            <div className="resultWarriors-dividerLine"></div>
            <div className="resultWarriors-dividerText">Обмен</div>
            <div className="resultWarriors-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultWarriors-tradeNote">
            <div className="resultWarriors-noteHeader">
              <span className="resultWarriors-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultWarriors-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultWarriors-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultWarriors-tradeActions">
          <button
            className="resultWarriors-actionButton resultWarriors-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultWarriors-actionButton resultWarriors-actionButton--reject"
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
    <div className="resultWarriors-container">
      <div className="resultWarriors-controls">
        <button
          className={`resultWarriors-button ${
            notificationCount > 0
              ? "resultWarriors-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultWarriors-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultWarriors-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultWarriors-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultWarriors-modalOverlay" onClick={closeModal}>
          <div
            className="resultWarriors-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultWarriors-modalHeader">
              <div className="resultWarriors-headerContent">
                <div className="resultWarriors-teamLogo"></div>
                <div className="resultWarriors-headerInfo">
                  <h2>Трейды Golden State Warriors</h2>
                  <div className="resultWarriors-headerSubtitle">
                    <span className="resultWarriors-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultWarriors-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="resultWarriors-closeModal"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="resultWarriors-modalContent">
              {trades.length === 0 ? (
                <div className="resultWarriors-noTrades">
                  <div className="resultWarriors-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultWarriors-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultWarriors-tradeItem"
                    >
                      <div className="resultWarriors-tradeHeader">
                        <div className="resultWarriors-tradeMeta">
                          <span className="resultWarriors-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultWarriors-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultWarriors-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultWarriors-modalFooter">
              <button
                className="resultWarriors-closeAllButton"
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

export default TradeResultWarriors;
