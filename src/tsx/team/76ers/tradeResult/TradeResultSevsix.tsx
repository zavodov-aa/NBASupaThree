import React, { useState, useEffect } from "react";
import "./tradeResultSevsix.css";
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

const TradeResultSevSix: React.FC = () => {
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
        .eq("trade_team", "Philadelphia 76ers")
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
        setError("Нет доступных трейдов для Philadelphia 76ers");
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
          .eq("trade_team", "Philadelphia 76ers")
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
    <div className={`resultSevSix-playerCard resultSevSix-playerCard--${type}`}>
      <div className="resultSevSix-playerHeader">
        <div className="resultSevSix-playerNameSection">
          <span className="resultSevSix-playerName">{player.name}</span>
        </div>
        <span className="resultSevSix-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultSevSix-draftPickCard">
      <div className="resultSevSix-pickHeader">
        <div className="resultSevSix-pickInfo">
          <span className="resultSevSix-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultSevSix-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultSevSix-pickDetails">
        <div className="resultSevSix-pickTeam">
          <span className="resultSevSix-teamLabel">От:</span>
          <span className="resultSevSix-teamName" title={pick.originalTeam}>
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
        className={`resultSevSix-tradeSection resultSevSix-tradeSection--${type}`}
      >
        <div className="resultSevSix-sectionHeader">
          <div className="resultSevSix-sectionTitle">{title}</div>
          <div className="resultSevSix-sectionCounts">
            {hasPlayers && (
              <span className="resultSevSix-countBadge resultSevSix-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultSevSix-countBadge resultSevSix-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultSevSix-sectionContent resultSevSix-sectionContent--players">
            <div className="resultSevSix-contentLabel">Игроки:</div>
            <div className="resultSevSix-cardsGrid">
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
          <div className="resultSevSix-sectionContent resultSevSix-sectionContent--picks">
            <div className="resultSevSix-contentLabel">Драфт-пики:</div>
            <div className="resultSevSix-cardsGrid">
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
    const isTeam1SevSix = team1Name === "Philadelphia 76ers";
    const isTeam2SevSix = team2Name === "Philadelphia 76ers";

    return (
      <div className="resultSevSix-tradeData">
        <div className="resultSevSix-tradeSummary">
          <div className="resultSevSix-summaryStats">
            <div className="resultSevSix-statItem">
              <div className="resultSevSix-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultSevSix-statLabel">
                активов от {isTeam2SevSix ? "Philadelphia 76ers" : team2Name}
              </div>
            </div>
            <div className="resultSevSix-exchangeArrow">⇄</div>
            <div className="resultSevSix-statItem">
              <div className="resultSevSix-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultSevSix-statLabel">
                активов от {isTeam1SevSix ? "Philadelphia 76ers" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultSevSix-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultSevSix-tradeDivider">
            <div className="resultSevSix-dividerLine"></div>
            <div className="resultSevSix-dividerText">Обмен</div>
            <div className="resultSevSix-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultSevSix-tradeNote">
            <div className="resultSevSix-noteHeader">
              <span className="resultSevSix-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultSevSix-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultSevSix-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultSevSix-tradeActions">
          <button
            className="resultSevSix-actionButton resultSevSix-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultSevSix-actionButton resultSevSix-actionButton--reject"
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
    <div className="resultSevSix-container">
      <div className="resultSevSix-controls">
        <button
          className={`resultSevSix-button ${
            notificationCount > 0 ? "resultSevSix-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultSevSix-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultSevSix-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultSevSix-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultSevSix-modalOverlay" onClick={closeModal}>
          <div
            className="resultSevSix-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultSevSix-modalHeader">
              <div className="resultSevSix-headerContent">
                <div className="resultSevSix-teamLogo"></div>
                <div className="resultSevSix-headerInfo">
                  <h2>Трейды Philadelphia 76ers</h2>
                  <div className="resultSevSix-headerSubtitle">
                    <span className="resultSevSix-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultSevSix-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultSevSix-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultSevSix-modalContent">
              {trades.length === 0 ? (
                <div className="resultSevSix-noTrades">
                  <div className="resultSevSix-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultSevSix-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultSevSix-tradeItem"
                    >
                      <div className="resultSevSix-tradeHeader">
                        <div className="resultSevSix-tradeMeta">
                          <span className="resultSevSix-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultSevSix-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultSevSix-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultSevSix-modalFooter">
              <button
                className="resultSevSix-closeAllButton"
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

export default TradeResultSevSix;
