import React, { useState, useEffect } from "react";
import "./tradeResultKnicks.css";
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

const TradeResultKnicks: React.FC = () => {
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
        .eq("trade_team", "New York Knicks")
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
        setError("Нет доступных трейдов для New York Knicks");
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
          .eq("trade_team", "New York Knicks")
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
    <div className={`resultKnicks-playerCard resultKnicks-playerCard--${type}`}>
      <div className="resultKnicks-playerHeader">
        <div className="resultKnicks-playerNameSection">
          <span className="resultKnicks-playerName">{player.name}</span>
        </div>
        <span className="resultKnicks-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultKnicks-draftPickCard">
      <div className="resultKnicks-pickHeader">
        <div className="resultKnicks-pickInfo">
          <span className="resultKnicks-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultKnicks-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultKnicks-pickDetails">
        <div className="resultKnicks-pickTeam">
          <span className="resultKnicks-teamLabel">От:</span>
          <span className="resultKnicks-teamName" title={pick.originalTeam}>
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
        className={`resultKnicks-tradeSection resultKnicks-tradeSection--${type}`}
      >
        <div className="resultKnicks-sectionHeader">
          <div className="resultKnicks-sectionTitle">{title}</div>
          <div className="resultKnicks-sectionCounts">
            {hasPlayers && (
              <span className="resultKnicks-countBadge resultKnicks-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultKnicks-countBadge resultKnicks-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultKnicks-sectionContent resultKnicks-sectionContent--players">
            <div className="resultKnicks-contentLabel">Игроки:</div>
            <div className="resultKnicks-cardsGrid">
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
          <div className="resultKnicks-sectionContent resultKnicks-sectionContent--picks">
            <div className="resultKnicks-contentLabel">Драфт-пики:</div>
            <div className="resultKnicks-cardsGrid">
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
    const isTeam1Knicks = team1Name === "New York Knicks";
    const isTeam2Knicks = team2Name === "New York Knicks";

    return (
      <div className="resultKnicks-tradeData">
        <div className="resultKnicks-tradeSummary">
          <div className="resultKnicks-summaryStats">
            <div className="resultKnicks-statItem">
              <div className="resultKnicks-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultKnicks-statLabel">
                активов от {isTeam2Knicks ? "New York Knicks" : team2Name}
              </div>
            </div>
            <div className="resultKnicks-exchangeArrow">⇄</div>
            <div className="resultKnicks-statItem">
              <div className="resultKnicks-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultKnicks-statLabel">
                активов от {isTeam1Knicks ? "New York Knicks" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultKnicks-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultKnicks-tradeDivider">
            <div className="resultKnicks-dividerLine"></div>
            <div className="resultKnicks-dividerText">Обмен</div>
            <div className="resultKnicks-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultKnicks-tradeNote">
            <div className="resultKnicks-noteHeader">
              <span className="resultKnicks-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultKnicks-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultKnicks-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultKnicks-tradeActions">
          <button
            className="resultKnicks-actionButton resultKnicks-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultKnicks-actionButton resultKnicks-actionButton--reject"
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
    <div className="resultKnicks-container">
      <div className="resultKnicks-controls">
        <button
          className={`resultKnicks-button ${
            notificationCount > 0 ? "resultKnicks-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultKnicks-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultKnicks-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultKnicks-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultKnicks-modalOverlay" onClick={closeModal}>
          <div
            className="resultKnicks-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultKnicks-modalHeader">
              <div className="resultKnicks-headerContent">
                <div className="resultKnicks-teamLogo"></div>
                <div className="resultKnicks-headerInfo">
                  <h2>Трейды New York Knicks</h2>
                  <div className="resultKnicks-headerSubtitle">
                    <span className="resultKnicks-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultKnicks-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultKnicks-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultKnicks-modalContent">
              {trades.length === 0 ? (
                <div className="resultKnicks-noTrades">
                  <div className="resultKnicks-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultKnicks-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultKnicks-tradeItem"
                    >
                      <div className="resultKnicks-tradeHeader">
                        <div className="resultKnicks-tradeMeta">
                          <span className="resultKnicks-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultKnicks-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultKnicks-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultKnicks-modalFooter">
              <button
                className="resultKnicks-closeAllButton"
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

export default TradeResultKnicks;
