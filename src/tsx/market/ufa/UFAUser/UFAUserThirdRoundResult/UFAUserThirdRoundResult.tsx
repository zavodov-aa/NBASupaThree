import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import "./ufaUserThirdRoundResult.css"; // можно оставить, если есть файл, но стили инлайн

type UFAThirdRoundResultRow = {
  player: string;
  ufa_third_round_first_stage_result?: string;
  ufa_third_round_second_stage_result?: string;
};

const UFAUserThirdRoundResult = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVerified, setPasswordVerified] = useState<boolean | null>(
    null,
  );

  // Состояния для первого этапа третьего раунда
  const [playersFirstStage, setPlayersFirstStage] = useState<string[]>([]);
  const [loadingFirstStage, setLoadingFirstStage] = useState<boolean>(false);
  const [showFirstStage, setShowFirstStage] = useState<boolean>(false);

  // Состояния для второго этапа третьего раунда
  const [playersSecondStage, setPlayersSecondStage] = useState<string[]>([]);
  const [loadingSecondStage, setLoadingSecondStage] = useState<boolean>(false);
  const [showSecondStage, setShowSecondStage] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Pass_team")
          .select("team")
          .order("team", { ascending: true });

        if (error) throw error;
        setTeams(data.map((item: { team: string }) => item.team));
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
    // Сбрасываем все результаты
    setPlayersFirstStage([]);
    setPlayersSecondStage([]);
    setShowFirstStage(false);
    setShowSecondStage(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordVerified(null);
    setShowFirstStage(false);
    setShowSecondStage(false);
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
      if (!isCorrect) setPassword("");
    } catch (error) {
      console.error("Ошибка проверки пароля:", error);
      setPasswordVerified(false);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const fetchFirstStage = async () => {
    if (!selectedTeam) return;
    setLoadingFirstStage(true);
    setShowFirstStage(true);
    try {
      const { data, error } = (await supabase
        .from("Market_UFA_third_round_result")
        .select("player, ufa_third_round_first_stage_result")
        .eq("ufa_third_round_first_stage_result", selectedTeam)) as {
        data: UFAThirdRoundResultRow[] | null;
        error: any;
      };

      if (error) throw error;
      const filtered =
        data?.filter(
          (item) => item.ufa_third_round_first_stage_result === selectedTeam,
        ) ?? [];
      setPlayersFirstStage(filtered.map((item) => item.player));
    } catch (error) {
      console.error(
        "Ошибка загрузки результатов 1 этапа третьего раунда:",
        error,
      );
      setShowFirstStage(false);
    } finally {
      setLoadingFirstStage(false);
    }
  };

  const fetchSecondStage = async () => {
    if (!selectedTeam) return;
    setLoadingSecondStage(true);
    setShowSecondStage(true);
    try {
      const { data, error } = (await supabase
        .from("Market_UFA_third_round_result")
        .select("player, ufa_third_round_second_stage_result")
        .eq("ufa_third_round_second_stage_result", selectedTeam)) as {
        data: UFAThirdRoundResultRow[] | null;
        error: any;
      };

      if (error) throw error;
      const filtered =
        data?.filter(
          (item) => item.ufa_third_round_second_stage_result === selectedTeam,
        ) ?? [];
      setPlayersSecondStage(filtered.map((item) => item.player));
    } catch (error) {
      console.error(
        "Ошибка загрузки результатов 2 этапа третьего раунда:",
        error,
      );
      setShowSecondStage(false);
    } finally {
      setLoadingSecondStage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") verifyPassword();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}
      >
        Выбор команды NBA — Результаты третьего раунда UFA (два этапа)
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

                  {/* Две кнопки для этапов третьего раунда */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <button
                      onClick={fetchFirstStage}
                      disabled={loadingFirstStage}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: loadingFirstStage ? "not-allowed" : "pointer",
                        opacity: loadingFirstStage ? 0.6 : 1,
                      }}
                    >
                      {loadingFirstStage ? "Загрузка..." : "Результаты 1 этапа"}
                    </button>
                    <button
                      onClick={fetchSecondStage}
                      disabled={loadingSecondStage}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: loadingSecondStage ? "not-allowed" : "pointer",
                        opacity: loadingSecondStage ? 0.6 : 1,
                      }}
                    >
                      {loadingSecondStage
                        ? "Загрузка..."
                        : "Результаты 2 этапа"}
                    </button>
                  </div>

                  {/* Блок результатов первого этапа третьего раунда */}
                  {showFirstStage && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Результаты 1 этапа третьего раунда UFA для команды{" "}
                        {selectedTeam}:
                      </h3>
                      <div
                        style={{
                          minHeight: "80px",
                          border: "1px dashed #0a0",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {loadingFirstStage ? (
                          <p>Загрузка результатов...</p>
                        ) : playersFirstStage.length > 0 ? (
                          <div>
                            <p style={{ marginBottom: "8px" }}>
                              Победы в первом этапе третьего раунда UFA по
                              следующим игрокам:
                            </p>
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                              {playersFirstStage.map((player, index) => (
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
                                  <strong>{player}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>
                            Ваша команда не выиграла в 1 этапе третьего раунда
                            UFA или результаты ещё не внесены
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Блок результатов второго этапа третьего раунда */}
                  {showSecondStage && (
                    <div>
                      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Результаты 2 этапа третьего раунда UFA для команды{" "}
                        {selectedTeam}:
                      </h3>
                      <div
                        style={{
                          minHeight: "80px",
                          border: "1px dashed #0a0",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {loadingSecondStage ? (
                          <p>Загрузка результатов...</p>
                        ) : playersSecondStage.length > 0 ? (
                          <div>
                            <p style={{ marginBottom: "8px" }}>
                              Победы во втором этапе третьего раунда UFA по
                              следующим игрокам:
                            </p>
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                              {playersSecondStage.map((player, index) => (
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
                                  <strong>{player}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>
                            Ваша команда не выиграла во 2 этапе третьего раунда
                            UFA или результаты ещё не внесены
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

export default UFAUserThirdRoundResult;
