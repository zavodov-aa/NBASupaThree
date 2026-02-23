// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../../../Supabase";

// const RFAResultFirstRound = () => {
//   const [teams, setTeams] = useState<string[]>([]);
//   const [selectedTeam, setSelectedTeam] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [passwordVerified, setPasswordVerified] = useState<boolean | null>(
//     null,
//   );
//   const [players, setPlayers] = useState<
//     Array<{
//       player: string;
//       rfa_first_round_result: string;
//     }>
//   >([]);
//   const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchTeams = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("Pass_team")
//           .select("team")
//           .order("team", { ascending: true });

//         if (error) throw error;

//         const teamNames = data.map((item: { team: string }) => item.team);
//         setTeams(teamNames);
//       } catch (error) {
//         console.error("Ошибка загрузки команд:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeams();
//   }, []);

//   const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTeam(e.target.value);
//     setPassword("");
//     setPasswordVerified(null);
//     setPlayers([]); // Сброс результатов при смене команды
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//     setPasswordVerified(null);
//   };

//   const verifyPassword = async () => {
//     if (!selectedTeam || !password) return;

//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("Pass_team")
//         .select("pass")
//         .eq("team", selectedTeam)
//         .single();

//       if (error) throw error;

//       const dbPassword = data.pass.toString();
//       const isCorrect = dbPassword === password.trim();

//       setPasswordVerified(isCorrect);

//       if (isCorrect) {
//         // Если пароль верный, загружаем результаты RFA
//         await fetchRFAResults();
//       } else {
//         setPassword("");
//       }
//     } catch (error) {
//       console.error("Ошибка проверки пароля:", error);
//       setPasswordVerified(false);
//       setPassword("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRFAResults = async () => {
//     if (!selectedTeam) return;

//     setLoadingPlayers(true);
//     try {
//       const { data, error } = await supabase
//         .from("Market_RFA_result")
//         .select("player, rfa_first_round_result")
//         .eq("rfa_first_round_result", selectedTeam);

//       if (error) throw error;

//       // Фильтруем только тех игроков, у которых в колонке rfa_first_round_result указана выбранная команда
//       const filteredPlayers = data
//         ? data.filter((item) => item.rfa_first_round_result === selectedTeam)
//         : [];

//       setPlayers(filteredPlayers);
//     } catch (error) {
//       console.error("Ошибка загрузки результатов RFA:", error);
//     } finally {
//       setLoadingPlayers(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       verifyPassword();
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2
//         style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}
//       >
//         Выбор команды NBA
//       </h2>

//       <div style={{ maxWidth: "400px" }}>
//         <select
//           value={selectedTeam}
//           onChange={handleTeamChange}
//           disabled={loading}
//           style={{
//             width: "100%",
//             padding: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//             fontSize: "16px",
//             marginBottom: "10px",
//           }}
//         >
//           <option value="">
//             {loading ? "Загрузка..." : "Выберите команду"}
//           </option>

//           {teams.map((team) => (
//             <option key={team} value={team}>
//               {team}
//             </option>
//           ))}
//         </select>

//         {selectedTeam && (
//           <div
//             style={{
//               marginTop: "15px",
//               padding: "15px",
//               backgroundColor: "#f0f9ff",
//               borderRadius: "5px",
//               border: "1px solid #bae6fd",
//             }}
//           >
//             <p style={{ color: "#0369a1", marginBottom: "10px" }}>
//               Выбрана команда: <strong>{selectedTeam}</strong>
//             </p>

//             <div style={{ marginTop: "10px" }}>
//               <label
//                 htmlFor="password"
//                 style={{
//                   display: "block",
//                   marginBottom: "5px",
//                   fontWeight: "500",
//                 }}
//               >
//                 Введите пароль:
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 onKeyPress={handleKeyPress}
//                 disabled={loading}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   fontSize: "16px",
//                   marginBottom: "10px",
//                 }}
//                 placeholder="Введите пароль"
//               />

//               <button
//                 onClick={verifyPassword}
//                 disabled={loading || !password}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   fontSize: "16px",
//                   cursor: loading || !password ? "not-allowed" : "pointer",
//                   opacity: loading || !password ? 0.6 : 1,
//                 }}
//               >
//                 {loading ? "Проверка..." : "Проверить пароль"}
//               </button>

//               {passwordVerified === false && (
//                 <div
//                   style={{
//                     marginTop: "10px",
//                     padding: "10px",
//                     backgroundColor: "#fee",
//                     color: "#c00",
//                     borderRadius: "5px",
//                     border: "1px solid #fcc",
//                   }}
//                 >
//                   Неправильный пароль
//                 </div>
//               )}

//               {passwordVerified === true && (
//                 <div
//                   style={{
//                     marginTop: "15px",
//                     padding: "15px",
//                     backgroundColor: "#e7ffe7",
//                     borderRadius: "5px",
//                     border: "1px solid #cfc",
//                   }}
//                 >
//                   <p style={{ color: "#0a0", marginBottom: "10px" }}>
//                     ✓ Пароль верный
//                   </p>

//                   <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
//                     Результаты 1 раунда RFA для команды {selectedTeam}:
//                   </h3>

//                   <div
//                     style={{
//                       minHeight: "100px",
//                       border: "1px dashed #0a0",
//                       borderRadius: "5px",
//                       padding: "10px",
//                     }}
//                   >
//                     {loadingPlayers ? (
//                       <p>Загрузка результатов...</p>
//                     ) : players.length > 0 ? (
//                       <div>
//                         <p style={{ marginBottom: "8px" }}>
//                           Победы в первом раунде RFA по следующим игрокам:
//                         </p>
//                         <ul style={{ listStyleType: "none", padding: 0 }}>
//                           {players.map((item, index) => (
//                             <li
//                               key={index}
//                               style={{
//                                 padding: "8px",
//                                 backgroundColor:
//                                   index % 2 === 0 ? "#f8f9fa" : "white",
//                                 marginBottom: "4px",
//                                 borderRadius: "4px",
//                               }}
//                             >
//                               <strong>{item.player}</strong>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ) : (
//                       <p>
//                         Ваша команда не выбирала игроков в 1 раунде RFA или
//                         результаты еще не внесены.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFAResultFirstRound;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";

const RFAResultFirstRound = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVerified, setPasswordVerified] = useState<boolean | null>(
    null,
  );
  const [players, setPlayers] = useState<
    Array<{
      player: string;
      rfa_first_round_result: string;
    }>
  >([]);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false); // Новое состояние для показа результатов

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Pass_team")
          .select("team")
          .order("team", { ascending: true });

        if (error) throw error;

        const teamNames = data.map((item: { team: string }) => item.team);
        setTeams(teamNames);
      } catch (error) {
        console.error("Ошибка загрузки команд:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
    setPassword("");
    setPasswordVerified(null);
    setPlayers([]);
    setShowResults(false); // Сброс показа результатов при смене команды
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordVerified(null);
    setShowResults(false); // Сброс показа результатов при изменении пароля
  };

  const verifyPassword = async () => {
    if (!selectedTeam || !password) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Pass_team")
        .select("pass")
        .eq("team", selectedTeam)
        .single();

      if (error) throw error;

      const dbPassword = data.pass.toString();
      const isCorrect = dbPassword === password.trim();

      setPasswordVerified(isCorrect);

      if (!isCorrect) {
        setPassword("");
      }
    } catch (error) {
      console.error("Ошибка проверки пароля:", error);
      setPasswordVerified(false);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const fetchRFAResults = async () => {
    if (!selectedTeam) return;

    setLoadingPlayers(true);
    setShowResults(true); // Показываем результаты
    try {
      const { data, error } = await supabase
        .from("Market_RFA_result")
        .select("player, rfa_first_round_result")
        .eq("rfa_first_round_result", selectedTeam);

      if (error) throw error;

      // Фильтруем только тех игроков, у которых в колонке rfa_first_round_result указана выбранная команда
      const filteredPlayers = data
        ? data.filter((item) => item.rfa_first_round_result === selectedTeam)
        : [];

      setPlayers(filteredPlayers);
    } catch (error) {
      console.error("Ошибка загрузки результатов RFA:", error);
      setShowResults(false); // Скрываем результаты при ошибке
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyPassword();
    }
  };

  const handleShowResults = () => {
    fetchRFAResults();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}
      >
        Выбор команды NBA
      </h2>

      <div style={{ maxWidth: "400px" }}>
        <select
          value={selectedTeam}
          onChange={handleTeamChange}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          <option value="">
            {loading ? "Загрузка..." : "Выберите команду"}
          </option>

          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>

        {selectedTeam && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#f0f9ff",
              borderRadius: "5px",
              border: "1px solid #bae6fd",
            }}
          >
            <p style={{ color: "#0369a1", marginBottom: "10px" }}>
              Выбрана команда: <strong>{selectedTeam}</strong>
            </p>

            <div style={{ marginTop: "10px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                Введите пароль:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
                placeholder="Введите пароль"
              />

              <button
                onClick={verifyPassword}
                disabled={loading || !password}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: loading || !password ? "not-allowed" : "pointer",
                  opacity: loading || !password ? 0.6 : 1,
                  marginBottom: "10px",
                }}
              >
                {loading ? "Проверка..." : "Проверить пароль"}
              </button>

              {passwordVerified === false && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#fee",
                    color: "#c00",
                    borderRadius: "5px",
                    border: "1px solid #fcc",
                  }}
                >
                  Неправильный пароль
                </div>
              )}

              {passwordVerified === true && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    backgroundColor: "#e7ffe7",
                    borderRadius: "5px",
                    border: "1px solid #cfc",
                  }}
                >
                  <p style={{ color: "#0a0", marginBottom: "10px" }}>
                    ✓ Пароль верный
                  </p>

                  {/* Кнопка для показа результатов */}
                  <button
                    onClick={handleShowResults}
                    disabled={loadingPlayers}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "16px",
                      cursor: loadingPlayers ? "not-allowed" : "pointer",
                      opacity: loadingPlayers ? 0.6 : 1,
                      marginBottom: "15px",
                    }}
                  >
                    {loadingPlayers
                      ? "Загрузка..."
                      : "Показать результаты 1 раунда RFA"}
                  </button>

                  {/* Блок с результатами */}
                  {showResults && (
                    <div>
                      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Результаты 1 раунда RFA для команды {selectedTeam}:
                      </h3>

                      <div
                        style={{
                          minHeight: "100px",
                          border: "1px dashed #0a0",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {loadingPlayers ? (
                          <p>Загрузка результатов...</p>
                        ) : players.length > 0 ? (
                          <div>
                            <p style={{ marginBottom: "8px" }}>
                              Победы в первом раунде RFA по следующим игрокам:
                            </p>
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                              {players.map((item, index) => (
                                <li
                                  key={index}
                                  style={{
                                    padding: "8px",
                                    backgroundColor:
                                      index % 2 === 0 ? "#f8f9fa" : "white",
                                    marginBottom: "4px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <strong>{item.player}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>
                            Ваша команда не выйграла в 1 этапе RFA или
                            результаты еще не внесены
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFAResultFirstRound;
