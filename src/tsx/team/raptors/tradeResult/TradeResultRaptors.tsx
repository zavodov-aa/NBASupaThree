import React, { useState, useEffect } from "react";
import "./tradeResultRaptors.css";
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

const TradeResultRaptors: React.FC = () => {
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
        .eq("trade_team", "Toronto Raptors")
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
        setError("Нет доступных трейдов для Toronto Raptors");
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
          .eq("trade_team", "Toronto Raptors")
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
      className={`resultRaptors-playerCard resultRaptors-playerCard--${type}`}
    >
      <div className="resultRaptors-playerHeader">
        <div className="resultRaptors-playerNameSection">
          <span className="resultRaptors-playerName">{player.name}</span>
        </div>
        <span className="resultRaptors-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultRaptors-draftPickCard">
      <div className="resultRaptors-pickHeader">
        <div className="resultRaptors-pickInfo">
          <span className="resultRaptors-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultRaptors-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultRaptors-pickDetails">
        <div className="resultRaptors-pickTeam">
          <span className="resultRaptors-teamLabel">От:</span>
          <span className="resultRaptors-teamName" title={pick.originalTeam}>
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
        className={`resultRaptors-tradeSection resultRaptors-tradeSection--${type}`}
      >
        <div className="resultRaptors-sectionHeader">
          <div className="resultRaptors-sectionTitle">{title}</div>
          <div className="resultRaptors-sectionCounts">
            {hasPlayers && (
              <span className="resultRaptors-countBadge resultRaptors-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultRaptors-countBadge resultRaptors-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultRaptors-sectionContent resultRaptors-sectionContent--players">
            <div className="resultRaptors-contentLabel">Игроки:</div>
            <div className="resultRaptors-cardsGrid">
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
          <div className="resultRaptors-sectionContent resultRaptors-sectionContent--picks">
            <div className="resultRaptors-contentLabel">Драфт-пики:</div>
            <div className="resultRaptors-cardsGrid">
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
    const isTeam1Raptors = team1Name === "Toronto Raptors";
    const isTeam2Raptors = team2Name === "Toronto Raptors";

    return (
      <div className="resultRaptors-tradeData">
        <div className="resultRaptors-tradeSummary">
          <div className="resultRaptors-summaryStats">
            <div className="resultRaptors-statItem">
              <div className="resultRaptors-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultRaptors-statLabel">
                активов от {isTeam2Raptors ? "Toronto Raptors" : team2Name}
              </div>
            </div>
            <div className="resultRaptors-exchangeArrow">⇄</div>
            <div className="resultRaptors-statItem">
              <div className="resultRaptors-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultRaptors-statLabel">
                активов от {isTeam1Raptors ? "Toronto Raptors" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultRaptors-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultRaptors-tradeDivider">
            <div className="resultRaptors-dividerLine"></div>
            <div className="resultRaptors-dividerText">Обмен</div>
            <div className="resultRaptors-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultRaptors-tradeNote">
            <div className="resultRaptors-noteHeader">
              <span className="resultRaptors-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultRaptors-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultRaptors-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultRaptors-tradeActions">
          <button
            className="resultRaptors-actionButton resultRaptors-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultRaptors-actionButton resultRaptors-actionButton--reject"
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
    <div className="resultRaptors-container">
      <div className="resultRaptors-controls">
        <button
          className={`resultRaptors-button ${
            notificationCount > 0
              ? "resultRaptors-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultRaptors-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultRaptors-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultRaptors-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultRaptors-modalOverlay" onClick={closeModal}>
          <div
            className="resultRaptors-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultRaptors-modalHeader">
              <div className="resultRaptors-headerContent">
                <div className="resultRaptors-teamLogo"></div>
                <div className="resultRaptors-headerInfo">
                  <h2>Трейды Toronto Raptors</h2>
                  <div className="resultRaptors-headerSubtitle">
                    <span className="resultRaptors-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultRaptors-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultRaptors-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultRaptors-modalContent">
              {trades.length === 0 ? (
                <div className="resultRaptors-noTrades">
                  <div className="resultRaptors-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultRaptors-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultRaptors-tradeItem"
                    >
                      <div className="resultRaptors-tradeHeader">
                        <div className="resultRaptors-tradeMeta">
                          <span className="resultRaptors-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultRaptors-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultRaptors-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultRaptors-modalFooter">
              <button
                className="resultRaptors-closeAllButton"
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

export default TradeResultRaptors;
