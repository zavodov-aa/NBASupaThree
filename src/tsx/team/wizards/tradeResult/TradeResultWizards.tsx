import React, { useState, useEffect } from "react";
import "./tradeResultWizards.css";
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

const TradeResultWizards: React.FC = () => {
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
        .eq("trade_team", "Washington Wizards")
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
        setError("Нет доступных трейдов для Washington Wizards");
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
          .eq("trade_team", "Washington Wizards")
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
      className={`resultWizards-playerCard resultWizards-playerCard--${type}`}
    >
      <div className="resultWizards-playerHeader">
        <div className="resultWizards-playerNameSection">
          <span className="resultWizards-playerName">{player.name}</span>
        </div>
        <span className="resultWizards-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultWizards-draftPickCard">
      <div className="resultWizards-pickHeader">
        <div className="resultWizards-pickInfo">
          <span className="resultWizards-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultWizards-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultWizards-pickDetails">
        <div className="resultWizards-pickTeam">
          <span className="resultWizards-teamLabel">От:</span>
          <span className="resultWizards-teamName" title={pick.originalTeam}>
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
        className={`resultWizards-tradeSection resultWizards-tradeSection--${type}`}
      >
        <div className="resultWizards-sectionHeader">
          <div className="resultWizards-sectionTitle">{title}</div>
          <div className="resultWizards-sectionCounts">
            {hasPlayers && (
              <span className="resultWizards-countBadge resultWizards-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultWizards-countBadge resultWizards-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultWizards-sectionContent resultWizards-sectionContent--players">
            <div className="resultWizards-contentLabel">Игроки:</div>
            <div className="resultWizards-cardsGrid">
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
          <div className="resultWizards-sectionContent resultWizards-sectionContent--picks">
            <div className="resultWizards-contentLabel">Драфт-пики:</div>
            <div className="resultWizards-cardsGrid">
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
    const isTeam1Wizards = team1Name === "Washington Wizards";
    const isTeam2Wizards = team2Name === "Washington Wizards";

    return (
      <div className="resultWizards-tradeData">
        <div className="resultWizards-tradeSummary">
          <div className="resultWizards-summaryStats">
            <div className="resultWizards-statItem">
              <div className="resultWizards-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultWizards-statLabel">
                активов от {isTeam2Wizards ? "Washington Wizards" : team2Name}
              </div>
            </div>
            <div className="resultWizards-exchangeArrow">⇄</div>
            <div className="resultWizards-statItem">
              <div className="resultWizards-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultWizards-statLabel">
                активов от {isTeam1Wizards ? "Washington Wizards" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultWizards-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultWizards-tradeDivider">
            <div className="resultWizards-dividerLine"></div>
            <div className="resultWizards-dividerText">Обмен</div>
            <div className="resultWizards-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultWizards-tradeNote">
            <div className="resultWizards-noteHeader">
              <span className="resultWizards-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultWizards-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultWizards-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultWizards-tradeActions">
          <button
            className="resultWizards-actionButton resultWizards-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultWizards-actionButton resultWizards-actionButton--reject"
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
    <div className="resultWizards-container">
      <div className="resultWizards-controls">
        <button
          className={`resultWizards-button ${
            notificationCount > 0
              ? "resultWizards-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultWizards-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultWizards-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultWizards-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultWizards-modalOverlay" onClick={closeModal}>
          <div
            className="resultWizards-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultWizards-modalHeader">
              <div className="resultWizards-headerContent">
                <div className="resultWizards-teamLogo"></div>
                <div className="resultWizards-headerInfo">
                  <h2>Трейды Washington Wizards</h2>
                  <div className="resultWizards-headerSubtitle">
                    <span className="resultWizards-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultWizards-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultWizards-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultWizards-modalContent">
              {trades.length === 0 ? (
                <div className="resultWizards-noTrades">
                  <div className="resultWizards-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultWizards-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultWizards-tradeItem"
                    >
                      <div className="resultWizards-tradeHeader">
                        <div className="resultWizards-tradeMeta">
                          <span className="resultWizards-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultWizards-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultWizards-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultWizards-modalFooter">
              <button
                className="resultWizards-closeAllButton"
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

export default TradeResultWizards;
