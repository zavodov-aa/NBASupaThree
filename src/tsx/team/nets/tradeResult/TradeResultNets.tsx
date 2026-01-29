import React, { useState, useEffect } from "react";
import "./tradeResultNets.css";
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

const TradeResultNets: React.FC = () => {
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
        .eq("trade_team", "Brooklyn Nets")
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
        setError("Нет доступных трейдов для Brooklyn Nets");
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
          .eq("trade_team", "Brooklyn Nets")
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
    <div className={`resultNets-playerCard resultNets-playerCard--${type}`}>
      <div className="resultNets-playerHeader">
        <div className="resultNets-playerNameSection">
          <span className="resultNets-playerName">{player.name}</span>
        </div>
        <span className="resultNets-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultNets-draftPickCard">
      <div className="resultNets-pickHeader">
        <div className="resultNets-pickInfo">
          <span className="resultNets-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultNets-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultNets-pickDetails">
        <div className="resultNets-pickTeam">
          <span className="resultNets-teamLabel">От:</span>
          <span className="resultNets-teamName" title={pick.originalTeam}>
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
        className={`resultNets-tradeSection resultNets-tradeSection--${type}`}
      >
        <div className="resultNets-sectionHeader">
          <div className="resultNets-sectionTitle">{title}</div>
          <div className="resultNets-sectionCounts">
            {hasPlayers && (
              <span className="resultNets-countBadge resultNets-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultNets-countBadge resultNets-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultNets-sectionContent resultNets-sectionContent--players">
            <div className="resultNets-contentLabel">Игроки:</div>
            <div className="resultNets-cardsGrid">
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
          <div className="resultNets-sectionContent resultNets-sectionContent--picks">
            <div className="resultNets-contentLabel">Драфт-пики:</div>
            <div className="resultNets-cardsGrid">
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
    const isTeam1Nets = team1Name === "Brooklyn Nets";
    const isTeam2Nets = team2Name === "Brooklyn Nets";

    return (
      <div className="resultNets-tradeData">
        <div className="resultNets-tradeSummary">
          <div className="resultNets-summaryStats">
            <div className="resultNets-statItem">
              <div className="resultNets-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultNets-statLabel">
                активов от {isTeam2Nets ? "Brooklyn Nets" : team2Name}
              </div>
            </div>
            <div className="resultNets-exchangeArrow">⇄</div>
            <div className="resultNets-statItem">
              <div className="resultNets-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultNets-statLabel">
                активов от {isTeam1Nets ? "Brooklyn Nets" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultNets-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultNets-tradeDivider">
            <div className="resultNets-dividerLine"></div>
            <div className="resultNets-dividerText">Обмен</div>
            <div className="resultNets-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultNets-tradeNote">
            <div className="resultNets-noteHeader">
              <span className="resultNets-noteTitle">Примечание к трейду</span>
              <span className="resultNets-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultNets-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultNets-tradeActions">
          <button
            className="resultNets-actionButton resultNets-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultNets-actionButton resultNets-actionButton--reject"
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
    <div className="resultNets-container">
      <div className="resultNets-controls">
        <button
          className={`resultNets-button ${
            notificationCount > 0 ? "resultNets-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultNets-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultNets-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultNets-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultNets-modalOverlay" onClick={closeModal}>
          <div
            className="resultNets-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultNets-modalHeader">
              <div className="resultNets-headerContent">
                <div className="resultNets-teamLogo"></div>
                <div className="resultNets-headerInfo">
                  <h2>Трейды Brooklyn Nets</h2>
                  <div className="resultNets-headerSubtitle">
                    <span className="resultNets-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultNets-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultNets-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultNets-modalContent">
              {trades.length === 0 ? (
                <div className="resultNets-noTrades">
                  <div className="resultNets-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultNets-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultNets-tradeItem"
                    >
                      <div className="resultNets-tradeHeader">
                        <div className="resultNets-tradeMeta">
                          <span className="resultNets-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultNets-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultNets-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultNets-modalFooter">
              <button
                className="resultNets-closeAllButton"
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

export default TradeResultNets;
