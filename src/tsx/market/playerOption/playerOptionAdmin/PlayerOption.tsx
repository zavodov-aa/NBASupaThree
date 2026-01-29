// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../../Supabase";

// interface Player {
//   id: number;
//   active_roster: string;
//   team: string;
//   year_one: string;
//   opt: string;
//   decision: string;
//   saved?: boolean;
// }

// interface MarketPO {
//   name: string;
//   team: string;
//   salary: string;
//   result: string;
// }

// interface MarketPODecision {
//   name: string;
//   result: string;
// }

// const PlayerOption: React.FC = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [saving, setSaving] = useState<{ [key: number]: boolean }>({});
//   const [connectionStatus, setConnectionStatus] = useState<string>("");
//   const [errorLog, setErrorLog] = useState<string[]>([]);
//   const [isSavingAll, setIsSavingAll] = useState<boolean>(false);

//   useEffect(() => {
//     fetchPlayers();
//   }, []);

//   const addToErrorLog = (error: string) => {
//     setErrorLog((prev) => [
//       ...prev,
//       `${new Date().toLocaleTimeString()}: ${error}`,
//     ]);
//   };

//   const testConnection = async () => {
//     try {
//       setConnectionStatus("Тестирование подключения...");
//       addToErrorLog("Начало тестирования подключения");

//       // Тест 1: Проверяем таблицу Players
//       const { data: playersTest, error: playersError } = await supabase
//         .from("Players")
//         .select("count")
//         .limit(1);

//       if (playersError) {
//         addToErrorLog(`Ошибка Players: ${playersError.message}`);
//         console.error("Тест Players:", playersError);
//       } else {
//         addToErrorLog("✅ Таблица Players доступна");
//       }

//       // Тест 2: Проверяем таблицу market_PO
//       const { data: marketTest, error: marketError } = await supabase
//         .from("market_PO")
//         .select("*")
//         .limit(1);

//       if (marketError) {
//         addToErrorLog(`Ошибка market_PO: ${marketError.message}`);
//         console.error("Тест market_PO:", marketError);
//       } else {
//         addToErrorLog("✅ Таблица market_PO доступна");
//       }

//       // Тест 3: Проверяем структуру таблицы
//       const { error: structureError } = await supabase
//         .from("market_PO")
//         .select("name, team, salary, result")
//         .limit(1);

//       if (structureError) {
//         addToErrorLog(
//           `Проблема со структурой таблицы: ${structureError.message}`,
//         );
//       } else {
//         addToErrorLog("✅ Структура таблицы market_PO корректна");
//       }

//       // Тест 4: Пробуем вставить тестовую запись
//       const testRecord = {
//         name: `Тест_${Date.now()}`,
//         team: "Тест",
//         salary: "0",
//         result: "Тест",
//       };

//       const { error: testInsertError } = await supabase
//         .from("market_PO")
//         .insert([testRecord]);

//       if (testInsertError) {
//         addToErrorLog(
//           `Ошибка INSERT: ${testInsertError.message} (код: ${testInsertError.code})`,
//         );

//         // Пробуем обновить, если запись уже существует
//         const { error: testUpdateError } = await supabase
//           .from("market_PO")
//           .update(testRecord)
//           .eq("name", testRecord.name);

//         if (testUpdateError) {
//           addToErrorLog(`Ошибка UPDATE: ${testUpdateError.message}`);
//         } else {
//           addToErrorLog("✅ UPDATE успешен");
//         }
//       } else {
//         addToErrorLog("✅ INSERT успешен");

//         // Удаляем тестовую запись
//         await supabase.from("market_PO").delete().eq("name", testRecord.name);
//         addToErrorLog("✅ Тестовая запись удалена");
//       }

//       setConnectionStatus("Тестирование завершено. Проверьте лог.");
//     } catch (error: any) {
//       const errorMsg = `Критическая ошибка тестирования: ${error.message}`;
//       addToErrorLog(errorMsg);
//       setConnectionStatus("Ошибка при тестировании");
//       console.error("Ошибка тестирования:", error);
//     }
//   };

//   const fetchPlayers = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       addToErrorLog("Начало загрузки игроков");

//       const { data, error } = await supabase
//         .from("Players")
//         .select("id, active_roster, team, year_one, opt")
//         .limit(50);

//       if (error) {
//         addToErrorLog(`Ошибка загрузки игроков: ${error.message}`);
//         throw error;
//       }

//       // Фильтрация игроков с опцией PO
//       const filteredData = (data || []).filter((item) => {
//         const opt = item.opt?.toUpperCase() || "";
//         const yearOne = item.year_one?.toUpperCase() || "";
//         return opt.includes("PO") && yearOne.includes("PO");
//       });

//       addToErrorLog(`Найдено игроков после фильтрации: ${filteredData.length}`);

//       // Загружаем существующие решения
//       const { data: existingDecisions, error: decisionsError } = await supabase
//         .from("market_PO")
//         .select("name, result");

//       if (decisionsError) {
//         addToErrorLog(`Ошибка загрузки решений: ${decisionsError.message}`);
//       } else {
//         addToErrorLog(
//           `Загружено сохраненных решений: ${existingDecisions?.length || 0}`,
//         );
//       }

//       // Создаем мап для быстрого поиска решений
//       const decisionsMap = new Map<string, string>();
//       (existingDecisions || []).forEach((item: MarketPODecision) => {
//         decisionsMap.set(item.name, item.result);
//       });

//       // Добавляем сохраненные решения к игрокам
//       const playersWithDecisions = filteredData.map((player: any) => ({
//         ...player,
//         decision: decisionsMap.get(player.active_roster) || "",
//         saved: decisionsMap.has(player.active_roster),
//       }));

//       setPlayers(playersWithDecisions);
//       addToErrorLog("✅ Загрузка игроков завершена успешно");
//     } catch (error: any) {
//       const errorMsg = `Ошибка загрузки: ${error.message}`;
//       addToErrorLog(errorMsg);
//       console.error("Ошибка:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDecisionChange = (playerId: number, decision: string) => {
//     setPlayers((prev) =>
//       prev.map((player) =>
//         player.id === playerId ? { ...player, decision, saved: false } : player,
//       ),
//     );
//   };

//   const checkIfRecordExists = async (playerName: string): Promise<boolean> => {
//     try {
//       const { data, error } = await supabase
//         .from("market_PO")
//         .select("name")
//         .eq("name", playerName)
//         .limit(1);

//       if (error) {
//         addToErrorLog(`Ошибка проверки записи ${playerName}: ${error.message}`);
//         return false;
//       }

//       return data && data.length > 0;
//     } catch (error) {
//       return false;
//     }
//   };

//   const savePlayerDecision = async (
//     playerData: any,
//   ): Promise<{ success: boolean; error?: any }> => {
//     try {
//       const exists = await checkIfRecordExists(playerData.name);

//       if (exists) {
//         // Обновляем существующую запись
//         const { error } = await supabase
//           .from("market_PO")
//           .update(playerData)
//           .eq("name", playerData.name);

//         if (error) {
//           return { success: false, error };
//         }
//         return { success: true };
//       } else {
//         // Вставляем новую запись
//         const { error } = await supabase.from("market_PO").insert([playerData]);

//         if (error) {
//           return { success: false, error };
//         }
//         return { success: true };
//       }
//     } catch (error) {
//       return { success: false, error };
//     }
//   };

//   const saveDecision = async (player: Player) => {
//     try {
//       // Валидация данных
//       if (!player.active_roster || player.active_roster.trim() === "") {
//         alert("Ошибка: Имя игрока не может быть пустым");
//         addToErrorLog("Попытка сохранения с пустым именем игрока");
//         return;
//       }

//       if (!player.decision || player.decision.trim() === "") {
//         alert("Пожалуйста, выберите решение (Принято/Отказано)");
//         return;
//       }

//       setSaving((prev) => ({ ...prev, [player.id]: true }));

//       const playerData = {
//         name: player.active_roster.trim(),
//         team: player.team?.trim() || "",
//         salary: player.year_one?.trim() || "",
//         result: player.decision.trim(),
//       };

//       addToErrorLog(`Сохранение: ${playerData.name} - ${playerData.result}`);

//       const result = await savePlayerDecision(playerData);

//       if (!result.success) {
//         throw result.error || new Error("Не удалось сохранить решение");
//       }

//       // Обновляем локальное состояние
//       setPlayers((prev) =>
//         prev.map((p) => (p.id === player.id ? { ...p, saved: true } : p)),
//       );

//       addToErrorLog(`✅ Успешно сохранено: ${player.active_roster}`);
//       alert(`✅ Решение для "${player.active_roster}" сохранено!`);
//     } catch (error: any) {
//       const errorDetails = {
//         message: error.message,
//         code: error.code,
//         details: error.details,
//         hint: error.hint,
//         player: player.active_roster,
//       };

//       console.error("Ошибка сохранения:", errorDetails);
//       addToErrorLog(
//         `💥 Ошибка сохранения ${player.active_roster}: ${error.message}`,
//       );

//       let userMessage = `Ошибка при сохранении решения для ${player.active_roster}`;

//       if (error.message?.includes("row-level security")) {
//         userMessage +=
//           "\n\nПроблема с правами доступа (RLS).\nПроверьте политики доступа в Supabase.";
//       } else if (error.message?.includes("duplicate key")) {
//         userMessage += "\n\nЗапись с таким именем уже существует.";
//       } else if (error.message?.includes("network")) {
//         userMessage +=
//           "\n\nПроблема с сетью. Проверьте подключение к интернету.";
//       }

//       alert(`${userMessage}\n\nТехническая информация: ${error.message}`);
//     } finally {
//       setSaving((prev) => ({ ...prev, [player.id]: false }));
//     }
//   };

//   const saveAllDecisions = async () => {
//     try {
//       const playersWithDecisions = players.filter(
//         (p) => p.decision && !p.saved,
//       );

//       if (playersWithDecisions.length === 0) {
//         alert("Нет новых решений для сохранения");
//         return;
//       }

//       // Используем window.confirm вместо глобального confirm
//       const userConfirmed = window.confirm(
//         `Сохранить ${playersWithDecisions.length} решений?`,
//       );
//       if (!userConfirmed) {
//         return;
//       }

//       setIsSavingAll(true);
//       addToErrorLog(
//         `Начало массового сохранения ${playersWithDecisions.length} решений`,
//       );

//       let successCount = 0;
//       let failCount = 0;
//       const failedPlayers: string[] = [];

//       // Сохраняем каждого игрока отдельно для лучшего контроля
//       for (const player of playersWithDecisions) {
//         try {
//           const playerData = {
//             name: player.active_roster.trim(),
//             team: player.team?.trim() || "",
//             salary: player.year_one?.trim() || "",
//             result: player.decision.trim(),
//           };

//           const result = await savePlayerDecision(playerData);

//           if (result.success) {
//             successCount++;
//             addToErrorLog(`✅ Сохранено: ${player.active_roster}`);

//             // Обновляем состояние для этого игрока
//             setPlayers((prev) =>
//               prev.map((p) => (p.id === player.id ? { ...p, saved: true } : p)),
//             );
//           } else {
//             throw result.error;
//           }
//         } catch (playerError: any) {
//           failCount++;
//           failedPlayers.push(player.active_roster);
//           addToErrorLog(
//             `❌ Ошибка сохранения ${player.active_roster}: ${playerError.message}`,
//           );
//         }
//       }

//       addToErrorLog(
//         `Массовое сохранение завершено. Успешно: ${successCount}, Ошибок: ${failCount}`,
//       );

//       if (failCount === 0) {
//         alert(`✅ Успешно сохранено ${successCount} решений!`);
//       } else {
//         alert(
//           `Сохранено ${successCount} из ${playersWithDecisions.length} решений.\n\nОшибки при сохранении: ${failCount}\n\nНе удалось сохранить:\n${failedPlayers.join("\n")}`,
//         );
//       }
//     } catch (error: any) {
//       console.error("Ошибка массового сохранения:", error);
//       addToErrorLog(
//         `💥 Критическая ошибка массового сохранения: ${error.message}`,
//       );
//       alert("Ошибка при массовом сохранении решений");
//     } finally {
//       setIsSavingAll(false);
//     }
//   };

//   const clearErrorLog = () => {
//     setErrorLog([]);
//   };

//   const refreshPage = () => {
//     window.location.reload();
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: "20px", textAlign: "center" }}>
//         <div>Загрузка игроков...</div>
//         <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
//           Проверяем подключение к базе данных
//         </div>
//       </div>
//     );
//   }

//   const hasUnsavedDecisions = players.some((p) => p.decision && !p.saved);
//   const hasSavedDecisions = players.some((p) => p.saved);

//   return (
//     <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <h2>Игроки с опцией PO</h2>

//       {/* Панель управления */}
//       <div
//         style={{
//           marginBottom: "30px",
//           padding: "15px",
//           backgroundColor: "#f5f5f5",
//           borderRadius: "8px",
//           border: "1px solid #ddd",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             flexWrap: "wrap",
//             marginBottom: "10px",
//           }}
//         >
//           <button
//             onClick={fetchPlayers}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#007bff",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontWeight: "bold",
//             }}
//           >
//             🔄 Обновить список
//           </button>

//           {hasUnsavedDecisions && (
//             <button
//               onClick={saveAllDecisions}
//               disabled={isSavingAll}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: isSavingAll ? "#6c757d" : "#28a745",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: isSavingAll ? "not-allowed" : "pointer",
//                 fontWeight: "bold",
//               }}
//             >
//               {isSavingAll ? (
//                 <>⏳ Сохранение...</>
//               ) : (
//                 <>
//                   💾 Сохранить все (
//                   {players.filter((p) => p.decision && !p.saved).length})
//                 </>
//               )}
//             </button>
//           )}

//           <button
//             onClick={testConnection}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#6c757d",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             🔧 Тест подключения
//           </button>

//           <button
//             onClick={refreshPage}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#17a2b8",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             🔄 Перезагрузить страницу
//           </button>

//           {errorLog.length > 0 && (
//             <button
//               onClick={clearErrorLog}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#dc3545",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               🗑️ Очистить лог ошибок ({errorLog.length})
//             </button>
//           )}
//         </div>

//         {connectionStatus && (
//           <div
//             style={{
//               marginTop: "10px",
//               padding: "10px",
//               backgroundColor: connectionStatus.includes("Ошибка")
//                 ? "#f8d7da"
//                 : "#d1ecf1",
//               color: connectionStatus.includes("Ошибка")
//                 ? "#721c24"
//                 : "#0c5460",
//               borderRadius: "4px",
//               fontSize: "14px",
//             }}
//           >
//             {connectionStatus}
//           </div>
//         )}
//       </div>

//       {/* Статистика */}
//       <div
//         style={{
//           display: "flex",
//           gap: "20px",
//           marginBottom: "20px",
//           padding: "10px",
//           backgroundColor: "#e9ecef",
//           borderRadius: "6px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <strong>Всего игроков:</strong> {players.length}
//         </div>
//         <div>
//           <strong>С решением:</strong>{" "}
//           {players.filter((p) => p.decision).length}
//         </div>
//         <div>
//           <strong>Сохранено:</strong> {players.filter((p) => p.saved).length}
//         </div>
//         <div>
//           <strong>Ожидают сохранения:</strong>{" "}
//           {players.filter((p) => p.decision && !p.saved).length}
//         </div>
//         <div>
//           <strong>Без решения:</strong>{" "}
//           {players.filter((p) => !p.decision).length}
//         </div>
//       </div>

//       {/* Лог ошибок (если есть) */}
//       {errorLog.length > 0 && (
//         <div
//           style={{
//             marginBottom: "20px",
//             padding: "15px",
//             backgroundColor: "#fff3cd",
//             border: "1px solid #ffeaa7",
//             borderRadius: "6px",
//             maxHeight: "200px",
//             overflowY: "auto",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "10px",
//             }}
//           >
//             <strong style={{ color: "#856404" }}>Лог операций:</strong>
//             <button
//               onClick={clearErrorLog}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#856404",
//                 cursor: "pointer",
//                 fontSize: "12px",
//               }}
//             >
//               Очистить
//             </button>
//           </div>
//           {errorLog
//             .slice(-10)
//             .reverse()
//             .map((log, index) => (
//               <div
//                 key={index}
//                 style={{
//                   fontSize: "12px",
//                   padding: "4px 0",
//                   borderBottom: "1px solid rgba(133, 100, 4, 0.1)",
//                   color:
//                     log.includes("❌") || log.includes("💥")
//                       ? "#dc3545"
//                       : log.includes("✅")
//                         ? "#28a745"
//                         : "#856404",
//                 }}
//               >
//                 {log}
//               </div>
//             ))}
//         </div>
//       )}

//       {/* Таблица игроков */}
//       {players.length === 0 ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "40px",
//             backgroundColor: "#f8f9fa",
//             borderRadius: "8px",
//             border: "2px dashed #dee2e6",
//           }}
//         >
//           <p style={{ fontSize: "18px", color: "#6c757d" }}>
//             Игроки с опцией PO не найдены
//           </p>
//           <p
//             style={{ fontSize: "14px", color: "#adb5bd", marginBottom: "20px" }}
//           >
//             Проверьте, что в таблице Players есть записи с опцией PO
//           </p>
//           <button
//             onClick={fetchPlayers}
//             style={{
//               padding: "10px 25px",
//               backgroundColor: "#007bff",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Попробовать снова
//           </button>
//         </div>
//       ) : (
//         <>
//           <div style={{ overflowX: "auto" }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               }}
//             >
//               <thead>
//                 <tr style={{ backgroundColor: "#343a40", color: "white" }}>
//                   <th
//                     style={{
//                       padding: "12px",
//                       textAlign: "left",
//                       minWidth: "200px",
//                     }}
//                   >
//                     Игрок
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px",
//                       textAlign: "left",
//                       minWidth: "120px",
//                     }}
//                   >
//                     Команда
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px",
//                       textAlign: "left",
//                       minWidth: "120px",
//                     }}
//                   >
//                     Зарплата
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px",
//                       textAlign: "left",
//                       minWidth: "150px",
//                     }}
//                   >
//                     Решение
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px",
//                       textAlign: "left",
//                       minWidth: "150px",
//                     }}
//                   >
//                     Статус
//                   </th>
//                   <th
//                     style={{
//                       padding: "12px",
//                       textAlign: "left",
//                       minWidth: "120px",
//                     }}
//                   >
//                     Действие
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {players.map((player) => (
//                   <tr
//                     key={player.id}
//                     style={{
//                       backgroundColor: player.saved ? "#d4edda" : "white",
//                       borderBottom: "1px solid #dee2e6",
//                       transition: "background-color 0.3s",
//                     }}
//                   >
//                     <td style={{ padding: "12px", fontWeight: "500" }}>
//                       {player.active_roster || "-"}
//                     </td>
//                     <td style={{ padding: "12px" }}>{player.team || "-"}</td>
//                     <td style={{ padding: "12px" }}>
//                       {player.year_one || "-"}
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <select
//                         value={player.decision || ""}
//                         onChange={(e) =>
//                           handleDecisionChange(player.id, e.target.value)
//                         }
//                         style={{
//                           padding: "8px 12px",
//                           width: "100%",
//                           borderRadius: "4px",
//                           border: "1px solid #ced4da",
//                           backgroundColor: "white",
//                         }}
//                       >
//                         <option value="">-- Выберите решение --</option>
//                         <option value="Принято">✅ Принято</option>
//                         <option value="Отказано">❌ Отказано</option>
//                       </select>
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       {player.saved ? (
//                         <span style={{ color: "#28a745", fontWeight: "bold" }}>
//                           ✅ Сохранено
//                         </span>
//                       ) : player.decision ? (
//                         <span style={{ color: "#ffc107", fontWeight: "bold" }}>
//                           ⚠️ Ожидает сохранения
//                         </span>
//                       ) : (
//                         <span style={{ color: "#6c757d" }}>❓ Не выбрано</span>
//                       )}
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <button
//                         onClick={() => saveDecision(player)}
//                         disabled={
//                           !player.decision || saving[player.id] || player.saved
//                         }
//                         style={{
//                           padding: "8px 16px",
//                           backgroundColor: player.saved
//                             ? "#6c757d"
//                             : player.decision
//                               ? "#007bff"
//                               : "#ced4da",
//                           color: "white",
//                           border: "none",
//                           borderRadius: "4px",
//                           cursor:
//                             player.decision && !player.saved
//                               ? "pointer"
//                               : "not-allowed",
//                           width: "100%",
//                           transition: "all 0.3s",
//                           fontWeight: "bold",
//                         }}
//                         title={
//                           player.saved
//                             ? "Уже сохранено"
//                             : !player.decision
//                               ? "Выберите решение"
//                               : ""
//                         }
//                       >
//                         {saving[player.id] ? (
//                           <>⏳ Сохранение...</>
//                         ) : player.saved ? (
//                           <>✅ Сохранено</>
//                         ) : (
//                           <>💾 Сохранить</>
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Подсказки */}
//           <div
//             style={{
//               marginTop: "30px",
//               padding: "20px",
//               backgroundColor: "#e7f3ff",
//               borderRadius: "8px",
//               border: "1px solid #b3d7ff",
//             }}
//           >
//             <h4 style={{ marginTop: 0, color: "#0056b3" }}>
//               Инструкция по устранению ошибок:
//             </h4>
//             <ol style={{ marginBottom: 0, paddingLeft: "20px" }}>
//               <li>
//                 <strong>Если возникает ошибка "ON CONFLICT":</strong> Нажмите
//                 "Тест подключения" для диагностики
//               </li>
//               <li>
//                 <strong>Проверьте RLS политики</strong> в Supabase Dashboard
//               </li>
//               <li>
//                 <strong>
//                   Убедитесь, что таблица <code>market_PO</code>
//                 </strong>{" "}
//                 существует и содержит поля: <code>name</code> (текст),{" "}
//                 <code>team</code>, <code>salary</code>, <code>result</code>
//               </li>
//               <li>
//                 <strong>Для решения проблемы с ON CONFLICT:</strong> выполните в
//                 Supabase SQL Editor:
//                 <pre
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     padding: "10px",
//                     borderRadius: "4px",
//                     margin: "5px 0",
//                   }}
//                 >
//                   ALTER TABLE market_PO ADD CONSTRAINT market_po_name_unique
//                   UNIQUE (name);
//                 </pre>
//               </li>
//               <li>
//                 <strong>Временно отключите RLS:</strong> если не удается
//                 сохранить данные
//                 <pre
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     padding: "10px",
//                     borderRadius: "4px",
//                     margin: "5px 0",
//                   }}
//                 >
//                   ALTER TABLE market_PO DISABLE ROW LEVEL SECURITY;
//                 </pre>
//               </li>
//             </ol>
//           </div>

//           {/* SQL для быстрого исправления */}
//           <div
//             style={{
//               marginTop: "20px",
//               padding: "15px",
//               backgroundColor: "#f8f9fa",
//               borderRadius: "6px",
//               border: "1px solid #ddd",
//             }}
//           >
//             <h5 style={{ marginTop: 0, color: "#495057" }}>
//               Быстрое исправление через Supabase SQL Editor:
//             </h5>
//             <div
//               style={{
//                 backgroundColor: "#212529",
//                 color: "#f8f9fa",
//                 padding: "15px",
//                 borderRadius: "4px",
//                 fontFamily: "monospace",
//                 fontSize: "14px",
//                 overflowX: "auto",
//               }}
//             >
//               <div>-- 1. Добавить уникальное ограничение на поле name</div>
//               <div>
//                 ALTER TABLE market_PO ADD CONSTRAINT market_po_name_unique
//                 UNIQUE (name);
//               </div>
//               <br />
//               <div>-- 2. Создать таблицу, если её нет</div>
//               <div>CREATE TABLE IF NOT EXISTS market_PO (</div>
//               <div> name TEXT PRIMARY KEY,</div>
//               <div> team TEXT,</div>
//               <div> salary TEXT,</div>
//               <div> result TEXT</div>
//               <div>);</div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PlayerOption;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../../../Supabase";

interface Player {
  id: number;
  active_roster: string;
  team: string;
  year_one: string;
  opt: string;
  decision: string;
  saved?: boolean;
  needsDecision?: boolean;
}

interface MarketPO {
  name: string;
  team: string;
  salary: string;
  result: string;
}

interface PlayerComparison {
  player: Player;
  marketData: MarketPO | null;
  isIdentical: boolean;
  hasDecision: boolean;
}

const PlayerOption: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<{ [key: number]: boolean }>({});
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [isSavingAll, setIsSavingAll] = useState<boolean>(false);
  const [showAllPlayers, setShowAllPlayers] = useState<boolean>(false);

  // Мемоизированные функции
  const addToErrorLog = useCallback((error: string) => {
    setErrorLog((prev) => [
      `${new Date().toLocaleTimeString()}: ${error}`,
      ...prev.slice(0, 99), // Ограничиваем лог 100 записями
    ]);
  }, []);

  // Функция для сравнения данных игрока с данными в market_PO
  const comparePlayerWithMarketData = useCallback(
    (player: Player, marketData: MarketPO | null): PlayerComparison => {
      if (!marketData) {
        return {
          player,
          marketData: null,
          isIdentical: false,
          hasDecision: false,
        };
      }

      const isIdentical =
        player.active_roster === marketData.name &&
        player.team === marketData.team &&
        player.year_one === marketData.salary;

      const hasDecision = Boolean(marketData.result?.trim());

      return {
        player,
        marketData,
        isIdentical,
        hasDecision,
      };
    },
    [],
  );

  // Функция для определения, нужно ли показывать игрока для принятия решения
  const shouldShowForDecision = useCallback(
    (comparison: PlayerComparison): boolean => {
      const { isIdentical, hasDecision } = comparison;

      // Если нет данных в market_PO - показываем
      if (!comparison.marketData) return true;

      // Если данные не совпадают - показываем
      if (!isIdentical) return true;

      // Если данные совпадают, но нет решения - показываем
      if (!hasDecision) return true;

      // Если все идентично и есть решение - скрываем
      return false;
    },
    [],
  );

  const fetchPlayers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      addToErrorLog("Начало загрузки игроков");

      // Параллельная загрузка данных
      const [playersResponse, marketDataResponse] = await Promise.all([
        supabase
          .from("Players")
          .select("id, active_roster, team, year_one, opt")
          .limit(50),
        supabase.from("market_PO").select("*"),
      ]);

      if (playersResponse.error) {
        addToErrorLog(
          `Ошибка загрузки игроков: ${playersResponse.error.message}`,
        );
        throw playersResponse.error;
      }

      if (marketDataResponse.error) {
        addToErrorLog(
          `Ошибка загрузки market_PO: ${marketDataResponse.error.message}`,
        );
      }

      // Создаем мап для быстрого поиска данных из market_PO
      const marketDataMap = new Map<string, MarketPO>();
      (marketDataResponse.data || []).forEach((item: MarketPO) => {
        marketDataMap.set(item.name, item);
      });

      // Фильтрация игроков с опцией PO
      const filteredPlayers = (playersResponse.data || []).filter((item) => {
        const opt = item.opt?.toUpperCase() || "";
        const yearOne = item.year_one?.toUpperCase() || "";
        return opt.includes("PO") && yearOne.includes("PO");
      });

      addToErrorLog(`Найдено игроков с PO: ${filteredPlayers.length}`);
      addToErrorLog(
        `Загружено записей из market_PO: ${marketDataResponse.data?.length || 0}`,
      );

      // Сравниваем каждого игрока с данными из market_PO
      const playersWithComparison = filteredPlayers.map((player: any) => {
        const marketData = marketDataMap.get(player.active_roster);
        const comparison = comparePlayerWithMarketData(
          player,
          marketData || null,
        ); // Изменение здесь
        const needsDecision = shouldShowForDecision(comparison);

        return {
          ...player,
          decision: marketData?.result || "",
          saved: Boolean(marketData?.result),
          needsDecision,
        };
      });

      setPlayers(playersWithComparison);
      addToErrorLog("✅ Загрузка и сравнение данных завершены");
    } catch (error: any) {
      const errorMsg = `Ошибка загрузки: ${error.message}`;
      addToErrorLog(errorMsg);
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  }, [addToErrorLog, comparePlayerWithMarketData, shouldShowForDecision]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const testConnection = async () => {
    try {
      setConnectionStatus("Тестирование подключения...");
      addToErrorLog("Начало тестирования подключения");

      // Проверяем обе таблицы параллельно
      const [playersTest, marketTest, structureTest] = await Promise.all([
        supabase.from("Players").select("count").limit(1),
        supabase.from("market_PO").select("*").limit(1),
        supabase
          .from("market_PO")
          .select("name, team, salary, result")
          .limit(1),
      ]);

      if (playersTest.error) {
        addToErrorLog(`Ошибка Players: ${playersTest.error.message}`);
      } else {
        addToErrorLog("✅ Таблица Players доступна");
      }

      if (marketTest.error) {
        addToErrorLog(`Ошибка market_PO: ${marketTest.error.message}`);
      } else {
        addToErrorLog("✅ Таблица market_PO доступна");
      }

      if (structureTest.error) {
        addToErrorLog(
          `Проблема со структурой таблицы: ${structureTest.error.message}`,
        );
      } else {
        addToErrorLog("✅ Структура таблицы market_PO корректна");
      }

      setConnectionStatus("Тестирование завершено. Проверьте лог.");
    } catch (error: any) {
      const errorMsg = `Критическая ошибка тестирования: ${error.message}`;
      addToErrorLog(errorMsg);
      setConnectionStatus("Ошибка при тестировании");
      console.error("Ошибка тестирования:", error);
    }
  };

  const handleDecisionChange = useCallback(
    (playerId: number, decision: string) => {
      setPlayers((prev) =>
        prev.map((player) =>
          player.id === playerId
            ? { ...player, decision, saved: false }
            : player,
        ),
      );
    },
    [],
  );

  const checkIfRecordExists = async (playerName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("market_PO")
        .select("name")
        .eq("name", playerName)
        .limit(1);

      if (error) {
        addToErrorLog(`Ошибка проверки записи ${playerName}: ${error.message}`);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      return false;
    }
  };

  const savePlayerDecision = async (
    playerData: any,
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      const exists = await checkIfRecordExists(playerData.name);

      if (exists) {
        const { error } = await supabase
          .from("market_PO")
          .update(playerData)
          .eq("name", playerData.name);

        if (error) {
          return { success: false, error };
        }
        return { success: true };
      } else {
        const { error } = await supabase.from("market_PO").insert([playerData]);
        if (error) {
          return { success: false, error };
        }
        return { success: true };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  const saveDecision = async (player: Player) => {
    try {
      if (!player.active_roster || player.active_roster.trim() === "") {
        alert("Ошибка: Имя игрока не может быть пустым");
        addToErrorLog("Попытка сохранения с пустым именем игрока");
        return;
      }

      if (!player.decision || player.decision.trim() === "") {
        alert("Пожалуйста, выберите решение (Принято/Отказано)");
        return;
      }

      setSaving((prev) => ({ ...prev, [player.id]: true }));

      const playerData = {
        name: player.active_roster.trim(),
        team: player.team?.trim() || "",
        salary: player.year_one?.trim() || "",
        result: player.decision.trim(),
      };

      addToErrorLog(`Сохранение: ${playerData.name} - ${playerData.result}`);

      const result = await savePlayerDecision(playerData);

      if (!result.success) {
        throw result.error || new Error("Не удалось сохранить решение");
      }

      // Обновляем локальное состояние
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === player.id ? { ...p, saved: true, needsDecision: false } : p,
        ),
      );

      addToErrorLog(`✅ Успешно сохранено: ${player.active_roster}`);
      alert(`✅ Решение для "${player.active_roster}" сохранено!`);
    } catch (error: any) {
      addToErrorLog(
        `💥 Ошибка сохранения ${player.active_roster}: ${error.message}`,
      );
      alert(
        `Ошибка при сохранении решения для ${player.active_roster}\n\n${error.message}`,
      );
    } finally {
      setSaving((prev) => ({ ...prev, [player.id]: false }));
    }
  };

  const saveAllDecisions = async () => {
    try {
      const playersWithDecisions = players.filter(
        (p) => p.decision && !p.saved && p.needsDecision,
      );

      if (playersWithDecisions.length === 0) {
        alert("Нет новых решений для сохранения");
        return;
      }

      const userConfirmed = window.confirm(
        `Сохранить ${playersWithDecisions.length} решений?`,
      );
      if (!userConfirmed) return;

      setIsSavingAll(true);
      addToErrorLog(
        `Начало массового сохранения ${playersWithDecisions.length} решений`,
      );

      let successCount = 0;
      let failCount = 0;
      const failedPlayers: string[] = [];

      for (const player of playersWithDecisions) {
        try {
          const playerData = {
            name: player.active_roster.trim(),
            team: player.team?.trim() || "",
            salary: player.year_one?.trim() || "",
            result: player.decision.trim(),
          };

          const result = await savePlayerDecision(playerData);

          if (result.success) {
            successCount++;
            addToErrorLog(`✅ Сохранено: ${player.active_roster}`);
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === player.id
                  ? { ...p, saved: true, needsDecision: false }
                  : p,
              ),
            );
          } else {
            throw result.error;
          }
        } catch (playerError: any) {
          failCount++;
          failedPlayers.push(player.active_roster);
          addToErrorLog(
            `❌ Ошибка сохранения ${player.active_roster}: ${playerError.message}`,
          );
        }
      }

      addToErrorLog(
        `Массовое сохранение завершено. Успешно: ${successCount}, Ошибок: ${failCount}`,
      );

      if (failCount === 0) {
        alert(`✅ Успешно сохранено ${successCount} решений!`);
      } else {
        alert(
          `Сохранено ${successCount} из ${playersWithDecisions.length} решений.\n\nОшибки при сохранении: ${failCount}\n\nНе удалось сохранить:\n${failedPlayers.join("\n")}`,
        );
      }
    } catch (error: any) {
      addToErrorLog(
        `💥 Критическая ошибка массового сохранения: ${error.message}`,
      );
      alert("Ошибка при массовом сохранении решений");
    } finally {
      setIsSavingAll(false);
    }
  };

  const clearErrorLog = () => {
    setErrorLog([]);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  // Мемоизированные вычисления для статистики
  const statistics = useMemo(() => {
    const visiblePlayers = showAllPlayers
      ? players
      : players.filter((p) => p.needsDecision);

    return {
      totalPlayers: players.length,
      visiblePlayers: visiblePlayers.length,
      withDecision: visiblePlayers.filter((p) => p.decision).length,
      saved: visiblePlayers.filter((p) => p.saved).length,
      pendingSave: visiblePlayers.filter((p) => p.decision && !p.saved).length,
      withoutDecision: visiblePlayers.filter((p) => !p.decision).length,
      hiddenPlayers: players.filter((p) => !p.needsDecision).length,
    };
  }, [players, showAllPlayers]);

  // Мемоизированный список отображаемых игроков
  const displayedPlayers = useMemo(() => {
    const filtered = showAllPlayers
      ? players
      : players.filter((p) => p.needsDecision);

    return filtered.sort((a, b) => {
      // Сначала несохраненные, затем без решений, затем сохраненные
      if (!a.saved && b.saved) return -1;
      if (a.saved && !b.saved) return 1;
      if (!a.decision && b.decision) return -1;
      if (a.decision && !b.decision) return 1;
      return 0;
    });
  }, [players, showAllPlayers]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Загрузка и сравнение данных...</div>
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          Проверяем наличие существующих решений
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Игроки с опцией PO</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Автоматически скрыты игроки, у которых данные в market_PO совпадают и
        есть решение
      </p>

      {/* Панель управления */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={fetchPlayers}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔄 Обновить список
          </button>

          {statistics.pendingSave > 0 && (
            <button
              onClick={saveAllDecisions}
              disabled={isSavingAll}
              style={{
                padding: "10px 20px",
                backgroundColor: isSavingAll ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSavingAll ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {isSavingAll ? (
                <>⏳ Сохранение...</>
              ) : (
                <>💾 Сохранить все ({statistics.pendingSave})</>
              )}
            </button>
          )}

          <button
            onClick={() => setShowAllPlayers(!showAllPlayers)}
            style={{
              padding: "10px 20px",
              backgroundColor: showAllPlayers ? "#17a2b8" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showAllPlayers ? "👁️ Скрыть решенные" : "👁️ Показать все"}
          </button>

          <button
            onClick={testConnection}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔧 Тест подключения
          </button>

          <button
            onClick={refreshPage}
            style={{
              padding: "10px 20px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔄 Перезагрузить страницу
          </button>

          {errorLog.length > 0 && (
            <button
              onClick={clearErrorLog}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🗑️ Очистить лог ({errorLog.length})
            </button>
          )}
        </div>

        {connectionStatus && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: connectionStatus.includes("Ошибка")
                ? "#f8d7da"
                : "#d1ecf1",
              color: connectionStatus.includes("Ошибка")
                ? "#721c24"
                : "#0c5460",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {connectionStatus}
          </div>
        )}
      </div>

      {/* Статистика */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#e9ecef",
          borderRadius: "6px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>Всего игроков:</strong>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            {statistics.totalPlayers}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>Показано:</strong>
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#007bff" }}
          >
            {statistics.visiblePlayers}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>Скрыто:</strong>
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#6c757d" }}
          >
            {statistics.hiddenPlayers}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>С решением:</strong>
          <span>{statistics.withDecision}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>Сохранено:</strong>
          <span style={{ color: "#28a745" }}>{statistics.saved}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>Ожидают сохранения:</strong>
          <span style={{ color: "#ffc107" }}>{statistics.pendingSave}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>Без решения:</strong>
          <span style={{ color: "#dc3545" }}>{statistics.withoutDecision}</span>
        </div>
      </div>

      {/* Лог ошибок */}
      {errorLog.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "6px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <strong style={{ color: "#856404" }}>Лог операций:</strong>
            <span style={{ fontSize: "12px", color: "#856404" }}>
              Последние {Math.min(10, errorLog.length)} записей
            </span>
          </div>
          {errorLog.slice(0, 10).map((log, index) => (
            <div
              key={index}
              style={{
                fontSize: "12px",
                padding: "4px 0",
                borderBottom: "1px solid rgba(133, 100, 4, 0.1)",
                color:
                  log.includes("❌") || log.includes("💥")
                    ? "#dc3545"
                    : log.includes("✅")
                      ? "#28a745"
                      : "#856404",
              }}
            >
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Таблица игроков */}
      {displayedPlayers.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "2px dashed #dee2e6",
          }}
        >
          <p style={{ fontSize: "18px", color: "#6c757d" }}>
            {showAllPlayers
              ? "Нет игроков с опцией PO"
              : "Нет игроков, требующих решения"}
          </p>
          <p
            style={{ fontSize: "14px", color: "#adb5bd", marginBottom: "20px" }}
          >
            {showAllPlayers
              ? "Проверьте, что в таблице Players есть записи с опцией PO"
              : `Все ${statistics.hiddenPlayers} игроков уже имеют решения и данные актуальны`}
          </p>
          <button
            onClick={fetchPlayers}
            style={{
              padding: "10px 25px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Обновить данные
          </button>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#343a40", color: "white" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      width: "30px",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      minWidth: "200px",
                    }}
                  >
                    Игрок
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      minWidth: "120px",
                    }}
                  >
                    Команда
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      minWidth: "120px",
                    }}
                  >
                    Зарплата
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      minWidth: "150px",
                    }}
                  >
                    Решение
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      minWidth: "150px",
                    }}
                  >
                    Статус
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      minWidth: "120px",
                    }}
                  >
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.map((player, index) => (
                  <tr
                    key={player.id}
                    style={{
                      backgroundColor: player.saved
                        ? player.needsDecision
                          ? "#fff3cd"
                          : "#d4edda"
                        : "white",
                      borderBottom: "1px solid #dee2e6",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <td style={{ padding: "12px", color: "#6c757d" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {player.active_roster || "-"}
                      {!player.needsDecision && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginLeft: "8px",
                          }}
                        >
                          (авто-скрыт)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>{player.team || "-"}</td>
                    <td style={{ padding: "12px" }}>
                      {player.year_one || "-"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <select
                        value={player.decision || ""}
                        onChange={(e) =>
                          handleDecisionChange(player.id, e.target.value)
                        }
                        disabled={!player.needsDecision}
                        style={{
                          padding: "8px 12px",
                          width: "100%",
                          borderRadius: "4px",
                          border: `1px solid ${!player.needsDecision ? "#ced4da" : "#007bff"}`,
                          backgroundColor: !player.needsDecision
                            ? "#e9ecef"
                            : "white",
                          cursor: !player.needsDecision
                            ? "not-allowed"
                            : "pointer",
                        }}
                        title={
                          !player.needsDecision
                            ? "Решение уже принято и данные актуальны"
                            : ""
                        }
                      >
                        <option value="">-- Выберите решение --</option>
                        <option value="Принято">✅ Принято</option>
                        <option value="Отказано">❌ Отказано</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {player.saved ? (
                        <span style={{ color: "#28a745", fontWeight: "bold" }}>
                          {player.needsDecision
                            ? "⚠️ Требует обновления"
                            : "✅ Решение принято"}
                        </span>
                      ) : player.decision ? (
                        <span style={{ color: "#ffc107", fontWeight: "bold" }}>
                          ⏳ Ожидает сохранения
                        </span>
                      ) : (
                        <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                          ❓ Требуется решение
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => saveDecision(player)}
                        disabled={
                          !player.decision ||
                          saving[player.id] ||
                          (player.saved && !player.needsDecision)
                        }
                        style={{
                          padding: "8px 16px",
                          backgroundColor:
                            player.saved && !player.needsDecision
                              ? "#6c757d"
                              : player.decision
                                ? "#007bff"
                                : "#ced4da",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor:
                            player.decision &&
                            (player.needsDecision || !player.saved)
                              ? "pointer"
                              : "not-allowed",
                          width: "100%",
                          transition: "all 0.3s",
                          fontWeight: "bold",
                        }}
                        title={
                          player.saved && !player.needsDecision
                            ? "Решение уже принято и данные актуальны"
                            : !player.decision
                              ? "Выберите решение"
                              : ""
                        }
                      >
                        {saving[player.id] ? (
                          <>⏳ Сохранение...</>
                        ) : player.saved && !player.needsDecision ? (
                          <>✅ Решено</>
                        ) : player.saved ? (
                          <>🔄 Обновить</>
                        ) : (
                          <>💾 Сохранить</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Информационная панель */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "#e7f3ff",
              borderRadius: "8px",
              border: "1px solid #b3d7ff",
            }}
          >
            <h4 style={{ marginTop: 0, color: "#0056b3" }}>
              Логика отображения игроков:
            </h4>
            <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
              <li>
                <strong>Показаны:</strong> Игроки, у которых:
                <ul>
                  <li>Нет записи в таблице market_PO</li>
                  <li>Данные в Players и market_PO не совпадают</li>
                  <li>
                    Есть запись в market_PO, но нет решения (result пустой)
                  </li>
                </ul>
              </li>
              <li>
                <strong>Скрыты:</strong> Игроки, у которых данные в Players и
                market_PO полностью совпадают и есть заполненное решение
              </li>
              <li>
                <strong>Статус "Требует обновления":</strong> Если данные
                изменились, но решение уже было сохранено ранее
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerOption;
