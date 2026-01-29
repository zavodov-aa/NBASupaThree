import React, { useState, useEffect } from "react";
import "./tradeResultMagic.css";
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

const TradeResultMagic: React.FC = () => {
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
        .eq("trade_team", "Orlando Magic")
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
        setError("Нет доступных трейдов для Orlando Magic");
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
          .eq("trade_team", "Orlando Magic")
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
    <div className={`resultMagic-playerCard resultMagic-playerCard--${type}`}>
      <div className="resultMagic-playerHeader">
        <div className="resultMagic-playerNameSection">
          <span className="resultMagic-playerName">{player.name}</span>
        </div>
        <span className="resultMagic-playerType">
          {type === "active" ? "Основной" : "G-Лига"}
        </span>
      </div>
    </div>
  );

  const DraftPickCard: React.FC<{
    pick: any;
  }> = ({ pick }) => (
    <div className="resultMagic-draftPickCard">
      <div className="resultMagic-pickHeader">
        <div className="resultMagic-pickInfo">
          <span className="resultMagic-pickYearRound">
            {pick.year} • {pick.round} раунд
          </span>
          <span className="resultMagic-pickType">{pick.type}</span>
        </div>
      </div>
      <div className="resultMagic-pickDetails">
        <div className="resultMagic-pickTeam">
          <span className="resultMagic-teamLabel">От:</span>
          <span className="resultMagic-teamName" title={pick.originalTeam}>
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
        className={`resultMagic-tradeSection resultMagic-tradeSection--${type}`}
      >
        <div className="resultMagic-sectionHeader">
          <div className="resultMagic-sectionTitle">{title}</div>
          <div className="resultMagic-sectionCounts">
            {hasPlayers && (
              <span className="resultMagic-countBadge resultMagic-countBadge--players">
                {players.length} игр.
              </span>
            )}
            {hasPicks && (
              <span className="resultMagic-countBadge resultMagic-countBadge--picks">
                {picks.length} пик.
              </span>
            )}
          </div>
        </div>

        {hasPlayers && (
          <div className="resultMagic-sectionContent resultMagic-sectionContent--players">
            <div className="resultMagic-contentLabel">Игроки:</div>
            <div className="resultMagic-cardsGrid">
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
          <div className="resultMagic-sectionContent resultMagic-sectionContent--picks">
            <div className="resultMagic-contentLabel">Драфт-пики:</div>
            <div className="resultMagic-cardsGrid">
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
    const isTeam1Magic = team1Name === "Orlando Magic";
    const isTeam2Magic = team2Name === "Orlando Magic";

    return (
      <div className="resultMagic-tradeData">
        <div className="resultMagic-tradeSummary">
          <div className="resultMagic-summaryStats">
            <div className="resultMagic-statItem">
              <div className="resultMagic-statValue">
                {team2Players.length + (data.draftPicksFromTeam2?.length || 0)}
              </div>
              <div className="resultMagic-statLabel">
                активов от {isTeam2Magic ? "Orlando Magic" : team2Name}
              </div>
            </div>
            <div className="resultMagic-exchangeArrow">⇄</div>
            <div className="resultMagic-statItem">
              <div className="resultMagic-statValue">
                {team1Players.length + (data.draftPicksFromTeam1?.length || 0)}
              </div>
              <div className="resultMagic-statLabel">
                активов от {isTeam1Magic ? "Orlando Magic" : team1Name}
              </div>
            </div>
          </div>
        </div>

        <div className="resultMagic-tradeFlow">
          <TradeSection
            title={`${team1Name} получает`}
            players={team2Players}
            picks={data.draftPicksFromTeam2 || []}
            type="team1"
          />

          <div className="resultMagic-tradeDivider">
            <div className="resultMagic-dividerLine"></div>
            <div className="resultMagic-dividerText">Обмен</div>
            <div className="resultMagic-dividerLine"></div>
          </div>

          <TradeSection
            title={`${team2Name} получает`}
            players={team1Players}
            picks={data.draftPicksFromTeam1 || []}
            type="team2"
          />
        </div>

        {data.tradeNote && (
          <div className="resultMagic-tradeNote">
            <div className="resultMagic-noteHeader">
              <span className="resultMagic-noteTitle">Примечание к трейду</span>
              <span className="resultMagic-noteLength">
                {data.noteLength || data.tradeNote.length} симв.
              </span>
            </div>
            <div className="resultMagic-noteContent">{data.tradeNote}</div>
          </div>
        )}

        {/* Кнопки принятия/отклонения сделки */}
        <div className="resultMagic-tradeActions">
          <button
            className="resultMagic-actionButton resultMagic-actionButton--accept"
            onClick={() => handleTradeResult(tradeId, "Принято")}
            disabled={processingTradeId === tradeId}
          >
            {processingTradeId === tradeId ? "Сохранение..." : "Принято"}
          </button>
          <button
            className="resultMagic-actionButton resultMagic-actionButton--reject"
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
    <div className="resultMagic-container">
      <div className="resultMagic-controls">
        <button
          className={`resultMagic-button ${
            notificationCount > 0 ? "resultMagic-button--hasNotifications" : ""
          }`}
          onClick={checkTrades}
          disabled={loading}
        >
          <span className="resultMagic-buttonText">
            {loading ? "Загрузка..." : "Проверить трейды"}
          </span>
          {notificationCount > 0 && (
            <span className="resultMagic-notificationCount">
              {notificationCount}
            </span>
          )}
        </button>

        {error && !isModalOpen && (
          <div className="resultMagic-errorMessage">{error}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="resultMagic-modalOverlay" onClick={closeModal}>
          <div
            className="resultMagic-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resultMagic-modalHeader">
              <div className="resultMagic-headerContent">
                <div className="resultMagic-teamLogo"></div>
                <div className="resultMagic-headerInfo">
                  <h2>Трейды Orlando Magic</h2>
                  <div className="resultMagic-headerSubtitle">
                    <span className="resultMagic-tradesCount">
                      {trades.length} сделок
                    </span>
                    {trades.length > 0 && trades[0].data.team2 && (
                      <span className="resultMagic-tradePartner">
                        • Торговый партнер: {trades[0].data.team2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="resultMagic-closeModal" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="resultMagic-modalContent">
              {trades.length === 0 ? (
                <div className="resultMagic-noTrades">
                  <div className="resultMagic-noTradesIcon">🏀</div>
                  <p>Нет доступных трейдов</p>
                </div>
              ) : (
                <div className="resultMagic-tradesList">
                  {trades.map((trade, index) => (
                    <div
                      key={trade.id || index}
                      className="resultMagic-tradeItem"
                    >
                      <div className="resultMagic-tradeHeader">
                        <div className="resultMagic-tradeMeta">
                          <span className="resultMagic-tradeNumber">
                            Сделка #{index + 1}
                          </span>
                          <span className="resultMagic-tradeTeams">
                            {trade.data.team1 || "Team 1"} ↔{" "}
                            {trade.data.team2 || "Team 2"}
                          </span>
                        </div>
                      </div>

                      <div className="resultMagic-tradeContent">
                        {renderTradeData(trade.data, trade.id)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resultMagic-modalFooter">
              <button
                className="resultMagic-closeAllButton"
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

export default TradeResultMagic;
