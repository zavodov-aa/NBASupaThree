import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";

type ResultRow = {
  player: string;
  rfa_first_round_result?: string;
  rfa_second_round_result?: string;
};

const RFAResultFullRound = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVerified, setPasswordVerified] = useState<boolean | null>(
    null,
  );

  // Состояния для первого раунда
  const [playersFirst, setPlayersFirst] = useState<string[]>([]);
  const [loadingFirst, setLoadingFirst] = useState<boolean>(false);
  const [showFirst, setShowFirst] = useState<boolean>(false);

  // Состояния для второго раунда
  const [playersSecond, setPlayersSecond] = useState<string[]>([]);
  const [loadingSecond, setLoadingSecond] = useState<boolean>(false);
  const [showSecond, setShowSecond] = useState<boolean>(false);

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
    setPlayersFirst([]);
    setPlayersSecond([]);
    setShowFirst(false);
    setShowSecond(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordVerified(null);
    setShowFirst(false);
    setShowSecond(false);
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

  const fetchFirstRound = async () => {
    if (!selectedTeam) return;
    setLoadingFirst(true);
    setShowFirst(true); // показываем блок (возможно с загрузкой)
    try {
      const { data, error } = (await supabase
        .from("Market_RFA_result")
        .select("player, rfa_first_round_result")
        .eq("rfa_first_round_result", selectedTeam)) as {
        data: ResultRow[] | null;
        error: any;
      };

      if (error) throw error;
      const filtered =
        data?.filter((item) => item.rfa_first_round_result === selectedTeam) ??
        [];
      setPlayersFirst(filtered.map((item) => item.player));
    } catch (error) {
      console.error("Ошибка загрузки результатов 1 раунда:", error);
      setShowFirst(false);
    } finally {
      setLoadingFirst(false);
    }
  };

  const fetchSecondRound = async () => {
    if (!selectedTeam) return;
    setLoadingSecond(true);
    setShowSecond(true);
    try {
      const { data, error } = (await supabase
        .from("Market_RFA_result")
        .select("player, rfa_second_round_result")
        .eq("rfa_second_round_result", selectedTeam)) as {
        data: ResultRow[] | null;
        error: any;
      };

      if (error) throw error;
      const filtered =
        data?.filter((item) => item.rfa_second_round_result === selectedTeam) ??
        [];
      setPlayersSecond(filtered.map((item) => item.player));
    } catch (error) {
      console.error("Ошибка загрузки результатов 2 раунда:", error);
      setShowSecond(false);
    } finally {
      setLoadingSecond(false);
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
        Выбор команды NBA — Результаты RFA
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

                  {/* Две кнопки для раундов */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <button
                      onClick={fetchFirstRound}
                      disabled={loadingFirst}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: loadingFirst ? "not-allowed" : "pointer",
                        opacity: loadingFirst ? 0.6 : 1,
                      }}
                    >
                      {loadingFirst ? "Загрузка..." : "Результаты 1 раунда"}
                    </button>
                    <button
                      onClick={fetchSecondRound}
                      disabled={loadingSecond}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: loadingSecond ? "not-allowed" : "pointer",
                        opacity: loadingSecond ? 0.6 : 1,
                      }}
                    >
                      {loadingSecond ? "Загрузка..." : "Результаты 2 раунда"}
                    </button>
                  </div>

                  {/* Блок результатов первого раунда */}
                  {showFirst && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Результаты 1 раунда RFA для команды {selectedTeam}:
                      </h3>
                      <div
                        style={{
                          minHeight: "80px",
                          border: "1px dashed #0a0",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {loadingFirst ? (
                          <p>Загрузка результатов...</p>
                        ) : playersFirst.length > 0 ? (
                          <div>
                            <p style={{ marginBottom: "8px" }}>
                              Победы в первом раунде RFA по следующим игрокам:
                            </p>
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                              {playersFirst.map((player, index) => (
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
                            Ваша команда не выиграла в 1 этапе RFA или
                            результаты ещё не внесены
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Блок результатов второго раунда */}
                  {showSecond && (
                    <div>
                      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        Результаты 2 раунда RFA для команды {selectedTeam}:
                      </h3>
                      <div
                        style={{
                          minHeight: "80px",
                          border: "1px dashed #0a0",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {loadingSecond ? (
                          <p>Загрузка результатов...</p>
                        ) : playersSecond.length > 0 ? (
                          <div>
                            <p style={{ marginBottom: "8px" }}>
                              Победы во втором раунде RFA по следующим игрокам:
                            </p>
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                              {playersSecond.map((player, index) => (
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
                            Ваша команда не выиграла во 2 этапе RFA или
                            результаты ещё не внесены
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

export default RFAResultFullRound;
