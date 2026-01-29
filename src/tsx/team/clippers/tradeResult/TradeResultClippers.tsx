import React, { useState, useEffect } from "react";
import "./tradeResultClippers.css";
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

const TradeResultClippers: React.FC = () => {
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
        .eq("trade_team", "Los Angeles Clippers")
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
        setError("Нет доступных трейдов для Los Angeles Clippers");
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
          .eq("trade_team", "Los Angeles Clippers")
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
      className={`resultClippers-playerCard resultClippers-playerCard--${type}`}
    >
      <div className="resultClippers-playerHeader">
        <div className="resultClippers-playerNameSection">
          <span className="resultClippers-playerName">{player.name}</span>
        </div>
        <span className="resultClippers-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultClippers-draftPickCard">
      <div className="resultClippers-pickHeader">
        <div className="resultClippers-pickInfo">
          <span className="resultClippers-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultClippers-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultClippers-pickDetails">
        <div className="resultClippers-pickTeam">
          <span className="resultClippers-teamLabel">От:</span>
          <span className="resultClippers-teamName" title={pick.originalTeam}>
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
        className={`resultClippers-tradeSection resultClippers-tradeSection--${type}`}
      >
        <div className="resultClippers-sectionHeader">
          <div className="resultClippers-sectionTitle">{title}</div>
          <div className="resultClippers-sectionCounts">
            {hasPlayers && (
              <span className="resultClippers-countBadge resultClippers-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultClippers-countBadge resultClippers-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultClippers-sectionContent resultClippers-sectionContent--players">
            <div className="resultClippers-contentLabel">Игроки:</div>
            <div className="resultClippers-cardsGrid">
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
          <div className="resultClippers-sectionContent resultClippers-sectionContent--picks">
            <div className="resultClippers-contentLabel">Драфт-пики:</div>
            <div className="resultClippers-cardsGrid">
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
    const isTeam1Clippers = team1Name === "Los Angeles Clippers";
    const isTeam2Clippers = team2Name === "Los Angeles Clippers";

    return (
      <div className="resultClippers-tradeData">
        <div className="resultClippers-tradeSummary">
          <div className="resultClippers-summaryStats">
            <div className="resultClippers-statItem">
              <div className="resultClippers-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultClippers-statLabel">
                активов от{" "}
                {isTeam2Clippers ? "Los Angeles Clippers" : team2Name}
              </div>
            </div>
            <div className="resultClippers-exchangeArrow">⇄</div>
            <div className="resultClippers-statItem">
              <div className="resultClippers-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultClippers-statLabel">
                активов от{" "}
                {isTeam1Clippers ? "Los Angeles Clippers" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultClippers-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultClippers-tradeDivider">
            <div className="resultClippers-dividerLine"></div>
            <div className="resultClippers-dividerText">Обмен</div>
            <div className="resultClippers-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultClippers-tradeNote">
            <div className="resultClippers-noteHeader">
              <span className="resultClippers-noteTitle">
                Примечание к трейду
              </span>
              <span className="resultClippers-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultClippers-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultClippers-tradeActions">
          <button
            className="resultClippers-actionButton resultClippers-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultClippers-actionButton resultClippers-actionButton--reject"
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
    <div className="resultClippers-container">
      <div className="resultClippers-controls">
        <button
          className={`resultClippers-button ${
            notificationCount > 0
              ? "resultClippers-button--hasNotifications"
              : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultClippers-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultClippers-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultClippers-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultClippers-modalOverlay" onClick={closeModal}>
          <div
            className="resultClippers-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultClippers-modalHeader">
              <div className="resultClippers-headerContent">
                <div className="resultClippers-teamLogo"></div>
                <div className="resultClippers-headerInfo">
                  <h2>Трейды Los Angeles Clippers</h2>
                  <div className="resultClippers-headerSubtitle">
                    <span className="resultClippers-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultClippers-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="resultClippers-closeModal"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="resultClippers-modalContent">
              {trades.length === 0 ? (
                <div className="resultClippers-noTrades">
                  <div className="resultClippers-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultClippers-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultClippers-tradeItem"
                    >
                      <div className="resultClippers-tradeHeader">
                        <div className="resultClippers-tradeMeta">
                          <span className="resultClippers-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultClippers-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultClippers-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultClippers-modalFooter">
              <button
                className="resultClippers-closeAllButton"
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

export default TradeResultClippers;
