// import React, { useState, useEffect } from "react";
// import "./tradesAll.css";
// import { supabase } from "../../../../Supabase";
// import TradesAllHeader from "./TradesAllHeader";

// interface TradeData {
//   team1: string;
//   team2: string;
//   activePlayersFromTeam1: Array<{
//     id: number;
//     name: string;
//     type: string;
//     [key: string]: any;
//   }>;
//   activePlayersFromTeam2: Array<{
//     id: number;
//     name: string;
//     type: string;
//     [key: string]: any;
//   }>;
//   gLeaguePlayersFromTeam1: Array<{
//     id: number;
//     name: string;
//     g_league: string | null;
//     type: string;
//     [key: string]: any;
//   }>;
//   gLeaguePlayersFromTeam2: Array<{
//     id: number;
//     name: string;
//     g_league: string | null;
//     type: string;
//     [key: string]: any;
//   }>;
//   draftPicksFromTeam1: Array<{
//     id: number;
//     year: number;
//     round: number;
//     originalTeam: string;
//     currentTeam: string;
//     type: string;
//     [key: string]: any;
//   }>;
//   draftPicksFromTeam2: Array<{
//     id: number;
//     year: number;
//     round: number;
//     originalTeam: string;
//     currentTeam: string;
//     type: string;
//     [key: string]: any;
//   }>;
//   tradeNote: string;
//   noteLength: number;
//   [key: string]: any;
// }

// type TradesAllTabType = "all" | "pending";

// interface TradeAsset {
//   id: number;
//   name: string;
//   type: "player" | "gleague" | "pick";
//   team?: string;
//   details?: string;
// }

// interface TradesAllItem {
//   id: string;
//   teamFrom: string;
//   teamTo: string;
//   players: string[];
//   assetsFrom: TradeAsset[];
//   assetsTo: TradeAsset[];
//   note?: string;
//   status: string;
//   date?: string;
//   result_agent?: string | null;
//   result_team?: string | null;
//   // Добавляем timestamp для сортировки
//   timestamp?: number;
// }

// interface TradesAllSectionProps {
//   title: string;
//   trades: TradesAllItem[];
//   emptyMessage: string;
//   showActions?: boolean;
//   onTradeDecision?: (
//     tradeId: string,
//     decision: "Принято" | "Отклонено",
//   ) => void;
//   isDecisionPending?: { [key: string]: boolean };
// }

// const TradeAssetsDisplay: React.FC<{ assets: TradeAsset[]; team: string }> = ({
//   assets,
//   team,
// }) => {
//   return (
//     <div className="tradeAssetsColumn">
//       <div className="tradeAssetsColumnHeader">
//         <span className="tradeAssetsTeamName">{team}</span>
//         <span className="tradeAssetsCount">{assets.length}</span>
//       </div>
//       <div className="tradeAssetsList">
//         {assets.slice(0, 3).map((asset, index) => (
//           <div
//             key={`${asset.id}-${index}`}
//             className={`tradeAssetItem tradeAssetItem-${asset.type}`}
//           >
//             <div className="tradeAssetInfo">
//               <span className="tradeAssetName">{asset.name}</span>
//               <div className="tradeAssetMeta">
//                 <span className="tradeAssetType">
//                   {asset.type === "player"
//                     ? "Игрок"
//                     : asset.type === "gleague"
//                       ? "G-лига"
//                       : "Драфт-пик"}
//                 </span>
//                 {asset.team && (
//                   <span className="tradeAssetTeam">{asset.team}</span>
//                 )}
//                 {asset.details && (
//                   <span className="tradeAssetDetails">• {asset.details}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         {assets.length > 3 && (
//           <div className="tradeAssetMore">+{assets.length - 3} еще</div>
//         )}
//       </div>
//     </div>
//   );
// };

// const TradesAllItemComponent: React.FC<{
//   trade: TradesAllItem;
//   showActions?: boolean;
//   onAccept?: () => void;
//   onReject?: () => void;
//   isDecisionPending?: boolean;
// }> = ({
//   trade,
//   showActions = false,
//   onAccept,
//   onReject,
//   isDecisionPending = false,
// }) => {
//   return (
//     <div className="tradesAllItem">
//       <div className="tradesAllHeader">
//         <div className="tradesAllTeams">
//           <span className="tradesAllTeam tradesAllTeamFrom">
//             {trade.teamFrom}
//           </span>
//           <span className="tradesAllArrow">→</span>
//           <span className="tradesAllTeam tradesAllTeamTo">{trade.teamTo}</span>
//         </div>
//         <span
//           className={`tradesAllStatus ${
//             trade.status === "Pending Review"
//               ? "tradesAllStatusPending"
//               : trade.status === "Rejected"
//                 ? "tradesAllStatusRejected"
//                 : "tradesAllStatusCompleted"
//           }`}
//         >
//           {trade.status}
//         </span>
//       </div>

//       <div className="tradeAssetsDisplay">
//         <TradeAssetsDisplay assets={trade.assetsFrom} team={trade.teamFrom} />
//         <div className="tradeAssetsExchange">
//           <div className="tradeAssetsExchangeLine"></div>
//         </div>
//         <TradeAssetsDisplay assets={trade.assetsTo} team={trade.teamTo} />
//       </div>

//       {trade.note && trade.note.trim() !== "" && (
//         <div className="tradesAllNote">
//           <div className="tradesAllNoteContent">
//             <strong>Примечание:</strong> {trade.note}
//           </div>
//         </div>
//       )}

//       {trade.date && <div className="tradesAllDate">{trade.date}</div>}

//       {showActions && (
//         <div className="tradeDecisionButtons">
//           <button
//             className="tradeDecisionButton tradeDecisionButtonAccept"
//             onClick={onAccept}
//             disabled={isDecisionPending}
//           >
//             {isDecisionPending ? "Обработка..." : "Принято"}
//           </button>
//           <button
//             className="tradeDecisionButton tradeDecisionButtonReject"
//             onClick={onReject}
//             disabled={isDecisionPending}
//           >
//             {isDecisionPending ? "Обработка..." : "Отклонено"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const TradesAllSection: React.FC<TradesAllSectionProps> = ({
//   title,
//   trades,
//   emptyMessage,
//   showActions = false,
//   onTradeDecision,
//   isDecisionPending = {},
// }) => (
//   <div className="tradesAllSection">
//     <h3 className="tradesAllTitle">{title}</h3>
//     {trades.length > 0 ? (
//       <div className="tradesAllList">
//         {trades.map((trade) => (
//           <TradesAllItemComponent
//             key={trade.id}
//             trade={trade}
//             showActions={showActions}
//             onAccept={() => onTradeDecision?.(trade.id, "Принято")}
//             onReject={() => onTradeDecision?.(trade.id, "Отклонено")}
//             isDecisionPending={isDecisionPending[trade.id]}
//           />
//         ))}
//       </div>
//     ) : (
//       <div className="tradesAllEmpty">
//         <p>{emptyMessage}</p>
//       </div>
//     )}
//   </div>
// );

// const TradesAll: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TradesAllTabType>("all");
//   const [pendingTrades, setPendingTrades] = useState<TradesAllItem[]>([]);
//   const [completedTrades, setCompletedTrades] = useState<TradesAllItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [decisionPending, setDecisionPending] = useState<{
//     [key: string]: boolean;
//   }>({});

//   // Функция для преобразования данных трейда в структурированные активы
//   const formatTradeAssets = (tradeData: TradeData) => {
//     const assetsFrom: TradeAsset[] = [];
//     const assetsTo: TradeAsset[] = [];

//     // Активные игроки
//     tradeData.activePlayersFromTeam1.forEach((player) => {
//       assetsFrom.push({
//         id: player.id,
//         name: player.name,
//         type: "player" as const,
//         details: "Активный состав",
//       });
//     });

//     tradeData.activePlayersFromTeam2.forEach((player) => {
//       assetsTo.push({
//         id: player.id,
//         name: player.name,
//         type: "player" as const,
//         details: "Активный состав",
//       });
//     });

//     // Игроки G-лиги
//     tradeData.gLeaguePlayersFromTeam1.forEach((player) => {
//       assetsFrom.push({
//         id: player.id,
//         name: player.name,
//         type: "gleague" as const,
//         details: "G-лига",
//       });
//     });

//     tradeData.gLeaguePlayersFromTeam2.forEach((player) => {
//       assetsTo.push({
//         id: player.id,
//         name: player.name,
//         type: "gleague" as const,
//         details: "G-лига",
//       });
//     });

//     // Драфт-пики
//     tradeData.draftPicksFromTeam1.forEach((pick) => {
//       assetsFrom.push({
//         id: pick.id,
//         name: `${pick.year} ${getRoundText(pick.round)}`,
//         type: "pick" as const,
//         team: pick.originalTeam,
//       });
//     });

//     tradeData.draftPicksFromTeam2.forEach((pick) => {
//       assetsTo.push({
//         id: pick.id,
//         name: `${pick.year} ${getRoundText(pick.round)}`,
//         type: "pick" as const,
//         team: pick.originalTeam,
//       });
//     });

//     return { assetsFrom, assetsTo };
//   };

//   // Функция для преобразования номера раунда в текст
//   const getRoundText = (round: number): string => {
//     switch (round) {
//       case 1:
//         return "1-й раунд";
//       case 2:
//         return "2-й раунд";
//       default:
//         return `${round}-й раунд`;
//     }
//   };

//   // Функция для проверки структуры таблицы
//   const checkTableStructure = async () => {
//     try {
//       console.log("Проверка структуры таблицы Trades...");

//       // Простой запрос для проверки существования таблицы
//       const { data, error } = await supabase
//         .from("Trades")
//         .select("id")
//         .limit(1);

//       if (error) {
//         console.error("Ошибка при проверке таблицы:", error);
//         return false;
//       }

//       console.log("Таблица Trades существует");
//       return true;
//     } catch (err) {
//       console.error("Ошибка проверки структуры:", err);
//       return false;
//     }
//   };

//   // Функция для загрузки трейдов на рассмотрении (упрощенная версия)
//   const fetchPendingTrades = async () => {
//     try {
//       console.log("Начало загрузки трейдов на рассмотрении...");
//       setIsLoading(true);
//       setError(null);

//       // Сначала загружаем все трейды с result_team = 'Принято'
//       const { data, error: supabaseError } = await supabase
//         .from("Trades")
//         .select("id, data, result_agent, result_team")
//         .eq("result_team", "Принято");

//       console.log("Полученные данные из Supabase:", data);
//       console.log("Ошибка Supabase:", supabaseError);

//       if (supabaseError) {
//         console.error("Ошибка Supabase:", supabaseError);
//         throw supabaseError;
//       }

//       // Фильтруем на клиенте те, где result_agent IS NULL или undefined
//       const pendingData = data.filter((trade) => {
//         const hasResultAgent =
//           trade.result_agent !== null && trade.result_agent !== undefined;
//         console.log(
//           `Трейд ${trade.id}: result_agent = ${trade.result_agent}, hasResultAgent = ${hasResultAgent}`,
//         );
//         return !hasResultAgent;
//       });

//       console.log("Отфильтрованные трейды (pending):", pendingData);

//       const formattedTrades: TradesAllItem[] = pendingData.map((trade) => {
//         const tradeData = trade.data as TradeData;
//         const { assetsFrom, assetsTo } = formatTradeAssets(tradeData);

//         return {
//           id: trade.id,
//           teamFrom: tradeData.team1 || "Неизвестная команда",
//           teamTo: tradeData.team2 || "Неизвестная команда",
//           players: [],
//           assetsFrom,
//           assetsTo,
//           note: tradeData.tradeNote || undefined,
//           status: "Pending Review",
//           result_agent: trade.result_agent,
//           result_team: trade.result_team,
//         };
//       });

//       console.log("Форматированные трейды на рассмотрении:", formattedTrades);
//       setPendingTrades(formattedTrades);
//     } catch (err: any) {
//       console.error("Ошибка в fetchPendingTrades:", err);
//       setError(`Ошибка загрузки: ${err.message || "Неизвестная ошибка"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Функция для загрузки завершенных трейдов (упрощенная версия)
//   const fetchCompletedTrades = async () => {
//     try {
//       console.log("Загрузка завершенных трейдов...");
//       setIsLoadingCompleted(true);
//       setError(null);

//       // Сначала загружаем все трейды
//       const { data, error: supabaseError } = await supabase
//         .from("Trades")
//         .select("id, data, result_agent, result_team");

//       console.log("Все трейды из Supabase:", data);
//       console.log("Ошибка Supabase:", supabaseError);

//       if (supabaseError) {
//         throw supabaseError;
//       }

//       // Фильтруем на клиенте те, где result_agent IS NOT NULL
//       const completedData = data.filter((trade) => {
//         const hasResultAgent =
//           trade.result_agent !== null && trade.result_agent !== undefined;
//         console.log(
//           `Трейд ${trade.id}: result_agent = ${trade.result_agent}, hasResultAgent = ${hasResultAgent}`,
//         );
//         return hasResultAgent;
//       });

//       console.log("Отфильтрованные завершенные трейды:", completedData);

//       const formattedTrades: TradesAllItem[] = completedData.map((trade) => {
//         const tradeData = trade.data as TradeData;
//         const { assetsFrom, assetsTo } = formatTradeAssets(tradeData);

//         return {
//           id: trade.id,
//           teamFrom: tradeData.team1 || "Неизвестная команда",
//           teamTo: tradeData.team2 || "Неизвестная команда",
//           players: [],
//           assetsFrom,
//           assetsTo,
//           note: tradeData.tradeNote || undefined,
//           status: trade.result_agent === "Принято" ? "Completed" : "Rejected",
//           result_agent: trade.result_agent,
//           result_team: trade.result_team,
//           // Добавляем timestamp для сортировки (используем ID как числовое значение, если это возможно)
//           timestamp: parseInt(trade.id) || 0,
//         };
//       });

//       // Сортируем трейды по timestamp в порядке убывания (новые вверху)
//       formattedTrades.sort((a, b) => {
//         // Если оба имеют timestamp, сортируем по нему
//         if (a.timestamp && b.timestamp) {
//           return b.timestamp - a.timestamp;
//         }
//         // Если только один имеет timestamp, он идет выше
//         if (a.timestamp && !b.timestamp) return -1;
//         if (!a.timestamp && b.timestamp) return 1;
//         // Иначе сортируем по ID как строки в обратном порядке
//         return b.id.localeCompare(a.id);
//       });

//       console.log(
//         "Форматированные и отсортированные завершенные трейды:",
//         formattedTrades,
//       );
//       setCompletedTrades(formattedTrades);
//     } catch (err: any) {
//       console.error("Ошибка загрузки завершенных трейдов:", err);
//       setError(
//         `Ошибка загрузки завершенных трейдов: ${err.message || "Неизвестная ошибка"}`,
//       );
//     } finally {
//       setIsLoadingCompleted(false);
//     }
//   };

//   // Функция для обновления решения агента
//   const updateTradeDecision = async (
//     tradeId: string,
//     decision: "Принято" | "Отклонено",
//   ) => {
//     try {
//       setDecisionPending((prev) => ({ ...prev, [tradeId]: true }));
//       setError(null);

//       console.log(`Обновление трейда ${tradeId} с решением: ${decision}`);

//       const { error: supabaseError } = await supabase
//         .from("Trades")
//         .update({ result_agent: decision })
//         .eq("id", tradeId);

//       console.log("Результат обновления:", supabaseError);

//       if (supabaseError) {
//         throw supabaseError;
//       }

//       // Обновляем локальные состояния
//       const tradeToMove = pendingTrades.find((trade) => trade.id === tradeId);

//       if (tradeToMove) {
//         const updatedTrade: TradesAllItem = {
//           ...tradeToMove,
//           status: decision === "Принято" ? "Completed" : "Rejected",
//           result_agent: decision,
//           // Добавляем текущий timestamp для правильной сортировки
//           timestamp: Date.now(),
//         };

//         // Удаляем из pendingTrades и добавляем в начало completedTrades
//         setPendingTrades((prev) =>
//           prev.filter((trade) => trade.id !== tradeId),
//         );
//         setCompletedTrades((prev) => {
//           const newCompletedTrades = [updatedTrade, ...prev];
//           // Сортируем по timestamp в порядке убывания
//           return newCompletedTrades.sort((a, b) => {
//             const timestampA = a.timestamp || 0;
//             const timestampB = b.timestamp || 0;
//             return timestampB - timestampA;
//           });
//         });

//         console.log("Трейд успешно перемещен в начало:", updatedTrade);
//       }
//     } catch (err: any) {
//       console.error("Error updating trade decision:", err);
//       setError(
//         `Не удалось обновить решение по трейду: ${err.message || "Неизвестная ошибка"}`,
//       );
//     } finally {
//       setDecisionPending((prev) => ({ ...prev, [tradeId]: false }));
//     }
//   };

//   // Загружаем данные при переключении вкладок
//   useEffect(() => {
//     const loadData = async () => {
//       // Проверяем структуру таблицы
//       const tableExists = await checkTableStructure();
//       if (!tableExists) {
//         setError("Таблица Trades не найдена или недоступна");
//         return;
//       }

//       if (activeTab === "pending") {
//         await fetchPendingTrades();
//       } else if (activeTab === "all") {
//         await fetchCompletedTrades();
//       }
//     };

//     loadData();
//   }, [activeTab]);

//   // Моковые данные для вкладки "Все трейды" (если нужно)
//   const tradesAllTrades: TradesAllItem[] = [
//     {
//       id: "1",
//       teamFrom: "LA Lakers",
//       teamTo: "Golden State Warriors",
//       players: [],
//       assetsFrom: [
//         {
//           id: 1,
//           name: "LeBron James",
//           type: "player",
//           details: "Активный состав",
//         },
//         {
//           id: 2,
//           name: "Anthony Davis",
//           type: "player",
//           details: "Активный состав",
//         },
//         { id: 3, name: "2024 1-й раунд", type: "pick", team: "LA Lakers" },
//       ],
//       assetsTo: [
//         {
//           id: 4,
//           name: "Stephen Curry",
//           type: "player",
//           details: "Активный состав",
//         },
//         {
//           id: 5,
//           name: "Draymond Green",
//           type: "player",
//           details: "Активный состав",
//         },
//         {
//           id: 6,
//           name: "2025 2-й раунд",
//           type: "pick",
//           team: "Golden State Warriors",
//         },
//       ],
//       note: "Обмен звездных игроков в рамках реструктуризации команд",
//       status: "Completed",
//       date: "2024-01-15",
//       timestamp: Date.now() - 86400000, // Вчера
//     },
//     {
//       id: "2",
//       teamFrom: "Boston Celtics",
//       teamTo: "Miami Heat",
//       players: [],
//       assetsFrom: [
//         {
//           id: 7,
//           name: "Jayson Tatum",
//           type: "player",
//           details: "Активный состав",
//         },
//         { id: 8, name: "2025 1-й раунд", type: "pick", team: "Boston Celtics" },
//         {
//           id: 12,
//           name: "2026 1-й раунд",
//           type: "pick",
//           team: "Boston Celtics",
//         },
//       ],
//       assetsTo: [
//         {
//           id: 9,
//           name: "Jimmy Butler",
//           type: "player",
//           details: "Активный состав",
//         },
//         {
//           id: 10,
//           name: "Tyler Herro",
//           type: "player",
//           details: "Активный состав",
//         },
//         { id: 11, name: "Jordan Poole", type: "gleague", details: "G-лига" },
//       ],
//       status: "Completed",
//       date: "2024-01-10",
//       timestamp: Date.now() - 172800000, // Позавчера
//     },
//   ];

//   // Объединяем реальные данные с моковыми, если реальных нет
//   const allTradesToDisplay =
//     completedTrades.length > 0
//       ? completedTrades
//       : tradesAllTrades.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

//   return (
//     <div className="tradesAllContainer">
//       <TradesAllHeader />
//       <div className="tradesAllBackground"></div>
//       <div className="tradesAll">
//         <div className="tradesAllTabs">
//           <button
//             className={`tradesAllTab ${activeTab === "all" ? "tradesAllTabActive" : ""}`}
//             onClick={() => setActiveTab("all")}
//           >
//             <span className="tradesAllTabLabel">Все трейды</span>
//           </button>
//           <button
//             className={`tradesAllTab ${activeTab === "pending" ? "tradesAllTabActive" : ""}`}
//             onClick={() => setActiveTab("pending")}
//           >
//             <span className="tradesAllTabLabel">На рассмотрении</span>
//           </button>
//         </div>

//         <div className="tradesAllContent">
//           {activeTab === "all" ? (
//             <>
//               {isLoadingCompleted ? (
//                 <div className="tradesAllLoading">
//                   <div className="tradesAllSpinner"></div>
//                   <p>Загрузка трейдов...</p>
//                 </div>
//               ) : error ? (
//                 <div className="tradesAllEmpty">
//                   <p>{error}</p>
//                   <button
//                     onClick={fetchCompletedTrades}
//                     className="tradesAllRetryButton"
//                   >
//                     Попробовать снова
//                   </button>
//                 </div>
//               ) : (
//                 <TradesAllSection
//                   title="Все трейды"
//                   trades={allTradesToDisplay}
//                   emptyMessage="Пока нет завершенных трейдов"
//                 />
//               )}
//             </>
//           ) : (
//             <>
//               {isLoading ? (
//                 <div className="tradesAllLoading">
//                   <div className="tradesAllSpinner"></div>
//                   <p>Загрузка трейдов...</p>
//                 </div>
//               ) : error ? (
//                 <div className="tradesAllEmpty">
//                   <p>{error}</p>
//                   <button
//                     onClick={fetchPendingTrades}
//                     className="tradesAllRetryButton"
//                   >
//                     Попробовать снова
//                   </button>
//                 </div>
//               ) : (
//                 <TradesAllSection
//                   title="Трейды на рассмотрении"
//                   trades={pendingTrades}
//                   emptyMessage="Нет трейдов, ожидающих рассмотрения"
//                   showActions={true}
//                   onTradeDecision={updateTradeDecision}
//                   isDecisionPending={decisionPending}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TradesAll;

import React, { useState, useEffect } from "react";
import "./tradesAll.css";
import { supabase } from "../../../../Supabase";
import TradesAllHeader from "./TradesAllHeader";

interface TradeData {
  team1: string;
  team2: string;
  activePlayersFromTeam1: Array<{ id: number; name: string; type: string }>;
  activePlayersFromTeam2: Array<{ id: number; name: string; type: string }>;
  gLeaguePlayersFromTeam1: Array<{
    id: number;
    name: string;
    g_league: string | null;
    type: string;
  }>;
  gLeaguePlayersFromTeam2: Array<{
    id: number;
    name: string;
    g_league: string | null;
    type: string;
  }>;
  draftPicksFromTeam1: Array<{
    id: number;
    year: number;
    round: number;
    originalTeam: string;
    currentTeam: string;
    type: string;
  }>;
  draftPicksFromTeam2: Array<{
    id: number;
    year: number;
    round: number;
    originalTeam: string;
    currentTeam: string;
    type: string;
  }>;
  tradeNote: string;
  noteLength: number;
}

type TradesAllTabType = "all" | "pending";

interface TradeAsset {
  id: number;
  name: string;
  type: "player" | "gleague" | "pick";
  team?: string;
  details?: string;
}

interface TradesAllItem {
  id: string;
  teamFrom: string;
  teamTo: string;
  assetsFrom: TradeAsset[];
  assetsTo: TradeAsset[];
  note?: string;
  status: string;
  date?: string;
  result_agent?: string | null;
  result_team?: string | null;
  timestamp?: number;
}

interface TradesAllSectionProps {
  title: string;
  trades: TradesAllItem[];
  emptyMessage: string;
  showActions?: boolean;
  onTradeDecision?: (
    tradeId: string,
    decision: "Принято" | "Отклонено",
  ) => void;
  isDecisionPending?: { [key: string]: boolean };
}

const TradesAllAssetsDisplay: React.FC<{
  assets: TradeAsset[];
  team: string;
}> = ({ assets, team }) => (
  <div className="tradesAllAssetsColumn">
    <div className="tradesAllAssetsHeader">
      <span className="tradesAllAssetsTeam">{team}</span>
      <span className="tradesAllAssetsCount">{assets.length}</span>
    </div>
    <div className="tradesAllAssetsList">
      {assets.slice(0, 3).map((asset) => (
        <div
          key={`${asset.id}-${asset.name}`}
          className={`tradesAllAssetItem tradesAllAsset-${asset.type}`}
        >
          <span className="tradesAllAssetName">{asset.name}</span>
          <div className="tradesAllAssetMeta">
            <span className="tradesAllAssetType">
              {asset.type === "player"
                ? "Игрок"
                : asset.type === "gleague"
                  ? "G-лига"
                  : "Драфт-пик"}
            </span>
            {asset.team && (
              <span className="tradesAllAssetTeam">{asset.team}</span>
            )}
            {asset.details && (
              <span className="tradesAllAssetDetails">• {asset.details}</span>
            )}
          </div>
        </div>
      ))}
      {assets.length > 3 && (
        <div className="tradesAllAssetMore">+{assets.length - 3} еще</div>
      )}
    </div>
  </div>
);

const TradesAllItemComponent: React.FC<{
  trade: TradesAllItem;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  isDecisionPending?: boolean;
}> = ({ trade, showActions, onAccept, onReject, isDecisionPending }) => (
  <div className="tradesAllItem">
    <div className="tradesAllItemHeader">
      <div className="tradesAllTeams">
        <span className="tradesAllTeam tradesAllTeamFrom">
          {trade.teamFrom}
        </span>
        <span className="tradesAllArrow">→</span>
        <span className="tradesAllTeam tradesAllTeamTo">{trade.teamTo}</span>
      </div>
      <span
        className={`tradesAllStatus tradesAllStatus-${trade.status.toLowerCase().replace(" ", "-")}`}
      >
        {trade.status}
      </span>
    </div>

    <div className="tradesAllAssetsDisplay">
      <TradesAllAssetsDisplay assets={trade.assetsFrom} team={trade.teamFrom} />
      <div className="tradesAllExchange">
        <div className="tradesAllExchangeLine"></div>
      </div>
      <TradesAllAssetsDisplay assets={trade.assetsTo} team={trade.teamTo} />
    </div>

    {trade.note?.trim() && (
      <div className="tradesAllNote">
        <strong>Примечание:</strong> {trade.note}
      </div>
    )}

    {trade.date && <div className="tradesAllDate">{trade.date}</div>}

    {showActions && (
      <div className="tradesAllButtons">
        <button
          className="tradesAllButton tradesAllButtonAccept"
          onClick={onAccept}
          disabled={isDecisionPending}
        >
          {isDecisionPending ? "Обработка..." : "Принято"}
        </button>
        <button
          className="tradesAllButton tradesAllButtonReject"
          onClick={onReject}
          disabled={isDecisionPending}
        >
          {isDecisionPending ? "Обработка..." : "Отклонено"}
        </button>
      </div>
    )}
  </div>
);

const TradesAllSection: React.FC<TradesAllSectionProps> = ({
  title,
  trades,
  emptyMessage,
  showActions = false,
  onTradeDecision,
  isDecisionPending = {},
}) => (
  <div className="tradesAllSection">
    <h3 className="tradesAllSectionTitle">{title}</h3>
    {trades.length > 0 ? (
      <div className="tradesAllList">
        {trades.map((trade) => (
          <TradesAllItemComponent
            key={trade.id}
            trade={trade}
            showActions={showActions}
            onAccept={() => onTradeDecision?.(trade.id, "Принято")}
            onReject={() => onTradeDecision?.(trade.id, "Отклонено")}
            isDecisionPending={isDecisionPending[trade.id]}
          />
        ))}
      </div>
    ) : (
      <div className="tradesAllEmpty">
        <p>{emptyMessage}</p>
      </div>
    )}
  </div>
);

const TradesAll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TradesAllTabType>("all");
  const [pendingTrades, setPendingTrades] = useState<TradesAllItem[]>([]);
  const [completedTrades, setCompletedTrades] = useState<TradesAllItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decisionPending, setDecisionPending] = useState<{
    [key: string]: boolean;
  }>({});

  const formatTradeAssets = (tradeData: TradeData) => {
    const formatPlayers = (players: any[], type: "player" | "gleague") =>
      players.map((player) => ({
        id: player.id,
        name: player.name,
        type,
        details: type === "player" ? "Активный состав" : "G-лига",
      }));

    const formatPicks = (picks: any[]) =>
      picks.map((pick) => ({
        id: pick.id,
        name: `${pick.year} ${pick.round === 1 ? "1-й раунд" : pick.round === 2 ? "2-й раунд" : `${pick.round}-й раунд`}`,
        type: "pick" as const,
        team: pick.originalTeam,
      }));

    return {
      assetsFrom: [
        ...formatPlayers(tradeData.activePlayersFromTeam1, "player"),
        ...formatPlayers(tradeData.gLeaguePlayersFromTeam1, "gleague"),
        ...formatPicks(tradeData.draftPicksFromTeam1),
      ],
      assetsTo: [
        ...formatPlayers(tradeData.activePlayersFromTeam2, "player"),
        ...formatPlayers(tradeData.gLeaguePlayersFromTeam2, "gleague"),
        ...formatPicks(tradeData.draftPicksFromTeam2),
      ],
    };
  };

  const loadPendingTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("Trades")
        .select("id, data, result_agent, result_team")
        .eq("result_team", "Принято");

      if (supabaseError) throw supabaseError;

      const pendingData = data.filter((trade) => !trade.result_agent);
      const formattedTrades = pendingData.map((trade) => {
        const tradeData = trade.data as TradeData;
        const { assetsFrom, assetsTo } = formatTradeAssets(tradeData);

        return {
          id: trade.id,
          teamFrom: tradeData.team1 || "Неизвестная команда",
          teamTo: tradeData.team2 || "Неизвестная команда",
          assetsFrom,
          assetsTo,
          note: tradeData.tradeNote || undefined,
          status: "Pending Review",
          result_agent: trade.result_agent,
          result_team: trade.result_team,
        };
      });

      setPendingTrades(formattedTrades);
    } catch (err: any) {
      setError(`Ошибка загрузки: ${err.message || "Неизвестная ошибка"}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedTrades = async () => {
    try {
      setLoadingCompleted(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("Trades")
        .select("id, data, result_agent, result_team");

      if (supabaseError) throw supabaseError;

      const completedData = data.filter((trade) => trade.result_agent);
      const formattedTrades = completedData.map((trade) => {
        const tradeData = trade.data as TradeData;
        const { assetsFrom, assetsTo } = formatTradeAssets(tradeData);

        return {
          id: trade.id,
          teamFrom: tradeData.team1 || "Неизвестная команда",
          teamTo: tradeData.team2 || "Неизвестная команда",
          assetsFrom,
          assetsTo,
          note: tradeData.tradeNote || undefined,
          status: trade.result_agent === "Принято" ? "Completed" : "Rejected",
          result_agent: trade.result_agent,
          result_team: trade.result_team,
          timestamp: parseInt(trade.id) || Date.now(),
        };
      });

      formattedTrades.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setCompletedTrades(formattedTrades);
    } catch (err: any) {
      setError(`Ошибка загрузки: ${err.message || "Неизвестная ошибка"}`);
    } finally {
      setLoadingCompleted(false);
    }
  };

  const handleTradeDecision = async (
    tradeId: string,
    decision: "Принято" | "Отклонено",
  ) => {
    try {
      setDecisionPending((prev) => ({ ...prev, [tradeId]: true }));

      const { error: supabaseError } = await supabase
        .from("Trades")
        .update({ result_agent: decision })
        .eq("id", tradeId);

      if (supabaseError) throw supabaseError;

      const tradeToMove = pendingTrades.find((trade) => trade.id === tradeId);
      if (tradeToMove) {
        const updatedTrade = {
          ...tradeToMove,
          status: decision === "Принято" ? "Completed" : "Rejected",
          result_agent: decision,
          timestamp: Date.now(),
        };

        setPendingTrades((prev) =>
          prev.filter((trade) => trade.id !== tradeId),
        );
        setCompletedTrades((prev) => {
          const newTrades = [updatedTrade, ...prev];
          return newTrades.sort(
            (a, b) => (b.timestamp || 0) - (a.timestamp || 0),
          );
        });
      }
    } catch (err: any) {
      setError(
        `Не удалось обновить решение: ${err.message || "Неизвестная ошибка"}`,
      );
    } finally {
      setDecisionPending((prev) => ({ ...prev, [tradeId]: false }));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === "pending") {
        await loadPendingTrades();
      } else {
        await loadCompletedTrades();
      }
    };
    loadData();
  }, [activeTab]);

  const mockTrades = [
    {
      id: "1",
      teamFrom: "LA Lakers",
      teamTo: "Golden State Warriors",
      assetsFrom: [
        {
          id: 1,
          name: "LeBron James",
          type: "player" as const,
          details: "Активный состав",
        },
        {
          id: 2,
          name: "Anthony Davis",
          type: "player" as const,
          details: "Активный состав",
        },
        {
          id: 3,
          name: "2024 1-й раунд",
          type: "pick" as const,
          team: "LA Lakers",
        },
      ],
      assetsTo: [
        {
          id: 4,
          name: "Stephen Curry",
          type: "player" as const,
          details: "Активный состав",
        },
        {
          id: 5,
          name: "Draymond Green",
          type: "player" as const,
          details: "Активный состав",
        },
        {
          id: 6,
          name: "2025 2-й раунд",
          type: "pick" as const,
          team: "Golden State Warriors",
        },
      ],
      note: "Обмен звездных игроков в рамках реструктуризации команд",
      status: "Completed",
      date: "2024-01-15",
      timestamp: Date.now() - 86400000,
    },
  ];

  const allTrades = completedTrades.length > 0 ? completedTrades : mockTrades;

  return (
    <div className="tradesAllContainer">
      <TradesAllHeader />
      <div className="tradesAllContent">
        <div className="tradesAllTabs">
          <button
            className={`tradesAllTab ${activeTab === "all" ? "tradesAllTabActive" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Все трейды
          </button>
          <button
            className={`tradesAllTab ${activeTab === "pending" ? "tradesAllTabActive" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            На рассмотрении
          </button>
        </div>

        <div className="tradesAllListContainer">
          {activeTab === "all" ? (
            loadingCompleted ? (
              <div className="tradesAllLoading">
                <div className="tradesAllSpinner"></div>
                <p>Загрузка трейдов...</p>
              </div>
            ) : error ? (
              <div className="tradesAllEmpty">
                <p>{error}</p>
                <button
                  onClick={loadCompletedTrades}
                  className="tradesAllRetryButton"
                >
                  Попробовать снова
                </button>
              </div>
            ) : (
              <TradesAllSection
                title="Все трейды"
                trades={allTrades}
                emptyMessage="Пока нет завершенных трейдов"
              />
            )
          ) : loading ? (
            <div className="tradesAllLoading">
              <div className="tradesAllSpinner"></div>
              <p>Загрузка трейдов...</p>
            </div>
          ) : error ? (
            <div className="tradesAllEmpty">
              <p>{error}</p>
              <button
                onClick={loadPendingTrades}
                className="tradesAllRetryButton"
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <TradesAllSection
              title="Трейды на рассмотрении"
              trades={pendingTrades}
              emptyMessage="Нет трейдов, ожидающих рассмотрения"
              showActions={true}
              onTradeDecision={handleTradeDecision}
              isDecisionPending={decisionPending}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TradesAll;
