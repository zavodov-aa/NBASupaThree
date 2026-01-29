// import React, { useState, ChangeEvent, useEffect } from "react";
// import "./bodyPenalties.css";
// import { supabase } from "../../../Supabase";

// interface Penalty {
//   id: number;
//   date: string;
//   team: string;
//   description: string;
// }

// interface NewPenalty {
//   date: string;
//   team: string;
//   description: string;
// }

// interface TeamStats {
//   name: string;
//   count: number;
// }

// const BodyPenalties = () => {
//   const [penalties, setPenalties] = useState<Penalty[]>([]);
//   const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
//   const [newPenalty, setNewPenalty] = useState<NewPenalty>({
//     date: "",
//     team: "",
//     description: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const nbaTeams: string[] = [
//     "Atlanta Hawks",
//     "Boston Celtics",
//     "Brooklyn Nets",
//     "Charlotte Hornets",
//     "Chicago Bulls",
//     "Cleveland Cavaliers",
//     "Dallas Mavericks",
//     "Denver Nuggets",
//     "Detroit Pistons",
//     "Golden State Warriors",
//     "Houston Rockets",
//     "Indiana Pacers",
//     "LA Clippers",
//     "Los Angeles Lakers",
//     "Memphis Grizzlies",
//     "Miami Heat",
//     "Milwaukee Bucks",
//     "Minnesota Timberwolves",
//     "New Orleans Pelicans",
//     "New York Knicks",
//     "Oklahoma City Thunder",
//     "Orlando Magic",
//     "Philadelphia 76ers",
//     "Phoenix Suns",
//     "Portland Trail Blazers",
//     "Sacramento Kings",
//     "San Antonio Spurs",
//     "Toronto Raptors",
//     "Utah Jazz",
//     "Washington Wizards",
//   ];

//   useEffect(() => {
//     fetchPenalties();
//   }, []);

//   useEffect(() => {
//     calculateTeamStats();
//   }, [penalties]);

//   const fetchPenalties = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const { data, error } = await supabase
//         .from("Penalties")
//         .select("*")
//         .order("date", { ascending: false });

//       if (error) throw error;

//       if (data) {
//         const formattedPenalties: Penalty[] = data.map((item: any) => ({
//           id: item.id,
//           date: item.date,
//           team: item.team || "",
//           description: item.description,
//         }));
//         setPenalties(formattedPenalties);
//       }
//     } catch (err: any) {
//       console.error("Ошибка при загрузке штрафов:", err);
//       setError(err.message || "Не удалось загрузить данные");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTeamStats = () => {
//     const stats: TeamStats[] = nbaTeams.map((team) => {
//       const teamPenalties = penalties.filter(
//         (penalty) => penalty.team === team
//       );
//       return {
//         name: team,
//         count: teamPenalties.length,
//       };
//     });
//     setTeamStats(stats);
//   };

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setNewPenalty({
//       ...newPenalty,
//       [name]: value,
//     });
//   };

//   const handleAddPenalty = () => {
//     setShowForm(true);
//     setSelectedTeam(null);
//   };

//   const handleSavePenalty = async () => {
//     if (!newPenalty.date || !newPenalty.description) {
//       alert("Пожалуйста, заполните все обязательные поля");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const { data, error } = await supabase
//         .from("Penalties")
//         .insert([
//           {
//             date: newPenalty.date,
//             team: newPenalty.team,
//             description: newPenalty.description,
//           },
//         ])
//         .select();

//       if (error) throw error;

//       if (data && data.length > 0) {
//         const penaltyToAdd: Penalty = {
//           id: data[0].id,
//           date: data[0].date,
//           team: data[0].team || "",
//           description: data[0].description,
//         };

//         setPenalties([penaltyToAdd, ...penalties]);
//         setNewPenalty({ date: "", team: "", description: "" });
//         setShowForm(false);
//       }
//     } catch (err: any) {
//       console.error("Ошибка при сохранении штрафа:", err);
//       setError(err.message || "Не удалось сохранить штраф");
//       alert("Ошибка при сохранении: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setSelectedTeam(null);
//     setNewPenalty({ date: "", team: "", description: "" });
//     setError(null);
//   };

//   const handleTeamClick = (teamName: string) => {
//     setSelectedTeam(teamName);
//     setShowForm(false);
//   };

//   const getTeamPenalties = (teamName: string) => {
//     return penalties.filter((penalty) => penalty.team === teamName);
//   };

//   return (
//     <div className="nba-penalties-container">
//       <button className="nba-add-penalty-btn" onClick={handleAddPenalty}>
//         Добавить штраф
//       </button>

//       {error && <div className="nba-error-message">Ошибка: {error}</div>}

//       {showForm && (
//         <div className="nba-penalty-form">
//           <h3>Добавление нового штрафа</h3>
//           <div className="nba-form-group">
//             <label>Дата *</label>
//             <input
//               type="date"
//               name="date"
//               value={newPenalty.date}
//               onChange={handleInputChange}
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="nba-form-group">
//             <label>Команда</label>
//             <select
//               name="team"
//               value={newPenalty.team}
//               onChange={handleInputChange}
//               disabled={loading}
//             >
//               <option value="">Выберите команду</option>
//               {nbaTeams.map((team, index) => (
//                 <option key={index} value={team}>
//                   {team}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="nba-form-group">
//             <label>Описание *</label>
//             <textarea
//               name="description"
//               value={newPenalty.description}
//               onChange={handleInputChange}
//               rows={4}
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="nba-form-actions">
//             <button
//               className="nba-save-btn"
//               onClick={handleSavePenalty}
//               disabled={loading}
//             >
//               {loading ? "Сохранение..." : "Сохранить"}
//             </button>
//             <button
//               className="nba-cancel-btn"
//               onClick={handleCancel}
//               disabled={loading}
//             >
//               Отмена
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="nba-teams-overview">
//         <h3>Команды НБА ({teamStats.length})</h3>

//         {loading ? (
//           <p>Загрузка данных...</p>
//         ) : (
//           <div className="nba-teams-grid">
//             {teamStats.map((team) => (
//               <div
//                 key={team.name}
//                 className={`nba-team-card ${
//                   selectedTeam === team.name ? "nba-team-selected" : ""
//                 }`}
//                 onClick={() => handleTeamClick(team.name)}
//               >
//                 <div className="nba-team-name">{team.name}</div>
//                 <div
//                   className={`nba-team-penalty-count ${
//                     team.count > 0 ? "nba-has-penalties" : "nba-no-penalties"
//                   }`}
//                 >
//                   {team.count > 0 ? `Штрафов: ${team.count}` : "Нет штрафов"}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {selectedTeam && (
//         <div className="nba-team-detail">
//           <div className="nba-detail-header">
//             <h3>{selectedTeam} - Детали штрафов</h3>
//             <button
//               className="nba-back-btn"
//               onClick={() => setSelectedTeam(null)}
//             >
//               ← Назад к списку
//             </button>
//           </div>

//           {getTeamPenalties(selectedTeam).length === 0 ? (
//             <p className="nba-no-penalties-message">
//               У этой команды нет штрафов
//             </p>
//           ) : (
//             <div className="nba-detail-list">
//               {getTeamPenalties(selectedTeam).map((penalty) => (
//                 <div key={penalty.id} className="nba-detail-item">
//                   <div className="nba-detail-date">
//                     <strong>Дата:</strong> {penalty.date}
//                   </div>
//                   <div className="nba-detail-description">
//                     <strong>Описание:</strong> {penalty.description}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BodyPenalties;


import React, { useState, ChangeEvent, useEffect } from "react";
import "./bodyPenalties.css";
import { supabase } from "../../../Supabase";

interface Penalty {
  id: number;
  date: string;
  team: string;
  description: string;
}

interface NewPenalty {
  date: string;
  team: string;
  description: string;
}

interface TeamStats {
  name: string;
  count: number;
}

const BodyPenalties = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [newPenalty, setNewPenalty] = useState<NewPenalty>({
    date: "",
    team: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nbaTeams: string[] = [
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "Charlotte Hornets",
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Dallas Mavericks",
    "Denver Nuggets",
    "Detroit Pistons",
    "Golden State Warriors",
    "Houston Rockets",
    "Indiana Pacers",
    "LA Clippers",
    "Los Angeles Lakers",
    "Memphis Grizzlies",
    "Miami Heat",
    "Milwaukee Bucks",
    "Minnesota Timberwolves",
    "New Orleans Pelicans",
    "New York Knicks",
    "Oklahoma City Thunder",
    "Orlando Magic",
    "Philadelphia 76ers",
    "Phoenix Suns",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "San Antonio Spurs",
    "Toronto Raptors",
    "Utah Jazz",
    "Washington Wizards",
  ];

  useEffect(() => {
    fetchPenalties();
  }, []);

  useEffect(() => {
    calculateTeamStats();
  }, [penalties]);

  const fetchPenalties = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("Penalties")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPenalties: Penalty[] = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          team: item.team || "",
          description: item.description,
        }));
        setPenalties(formattedPenalties);
      }
    } catch (err: any) {
      console.error("Ошибка при загрузке штрафов:", err);
      setError(err.message || "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  const calculateTeamStats = () => {
    const stats: TeamStats[] = nbaTeams.map((team) => {
      const teamPenalties = penalties.filter(
        (penalty) => penalty.team === team
      );
      return {
        name: team,
        count: teamPenalties.length,
      };
    });
    setTeamStats(stats);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPenalty({
      ...newPenalty,
      [name]: value,
    });
  };

  const handleAddPenalty = () => {
    setShowForm(true);
    setSelectedTeam(null);
  };

  const handleSavePenalty = async () => {
    if (!newPenalty.date || !newPenalty.description) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("Penalties")
        .insert([
          {
            date: newPenalty.date,
            team: newPenalty.team,
            description: newPenalty.description,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const penaltyToAdd: Penalty = {
          id: data[0].id,
          date: data[0].date,
          team: data[0].team || "",
          description: data[0].description,
        };

        setPenalties([penaltyToAdd, ...penalties]);
        setNewPenalty({ date: "", team: "", description: "" });
        setShowForm(false);
      }
    } catch (err: any) {
      console.error("Ошибка при сохранении штрафа:", err);
      setError(err.message || "Не удалось сохранить штраф");
      alert("Ошибка при сохранении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTeam(null);
    setNewPenalty({ date: "", team: "", description: "" });
    setError(null);
  };

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName);
    setShowForm(false);
  };

  const getTeamPenalties = (teamName: string) => {
    return penalties.filter((penalty) => penalty.team === teamName);
  };

  return (
    <div className="nba-penalties-container">
      <div className="nba-header-section">
        <h1 className="nba-main-title">Штрафы НБА</h1>
        <button
          className="nba-add-penalty-btn"
          onClick={handleAddPenalty}
          disabled={loading}
        >
          + Добавить штраф
        </button>
      </div>

      {error && (
        <div className="nba-error-message">
          <span className="nba-error-icon">⚠️</span> Ошибка: {error}
        </div>
      )}

      {showForm && (
        <div className="nba-penalty-form">
          <div className="nba-form-header">
            <h3>Добавление нового штрафа</h3>
            <button
              className="nba-close-form-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              ×
            </button>
          </div>
          <div className="nba-form-content">
            <div className="nba-form-group">
              <label htmlFor="date">Дата *</label>
              <input
                id="date"
                type="date"
                name="date"
                value={newPenalty.date}
                onChange={handleInputChange}
                required
                disabled={loading}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="nba-form-group">
              <label htmlFor="team">Команда</label>
              <select
                id="team"
                name="team"
                value={newPenalty.team}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Выберите команду</option>
                {nbaTeams.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
            <div className="nba-form-group">
              <label htmlFor="description">Описание *</label>
              <textarea
                id="description"
                name="description"
                value={newPenalty.description}
                onChange={handleInputChange}
                rows={4}
                required
                disabled={loading}
                placeholder="Введите описание штрафа..."
              />
            </div>
            <div className="nba-form-actions">
              <button
                className="nba-save-btn"
                onClick={handleSavePenalty}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="nba-loading-spinner"></span>
                    Сохранение...
                  </>
                ) : (
                  "Сохранить"
                )}
              </button>
              <button
                className="nba-cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="nba-teams-overview">
        <div className="nba-overview-header">
          <h3>Команды НБА ({teamStats.length})</h3>
          <div className="nba-stats-summary">
            Всего штрафов: {penalties.length}
          </div>
        </div>

        {loading && !penalties.length ? (
          <div className="nba-loading-container">
            <div className="nba-loading-spinner-large"></div>
            <p>Загрузка данных...</p>
          </div>
        ) : (
          <div className="nba-teams-grid">
            {teamStats.map((team) => (
              <div
                key={team.name}
                className={`nba-team-card ${
                  selectedTeam === team.name ? "nba-team-selected" : ""
                } ${team.count > 0 ? "nba-has-penalties" : "nba-no-penalties"}`}
                onClick={() => handleTeamClick(team.name)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleTeamClick(team.name)
                }
              >
                <div className="nba-team-logo-placeholder">
                  {team.name.charAt(0)}
                </div>
                <div className="nba-team-content">
                  <div className="nba-team-name">{team.name}</div>
                  <div className="nba-team-penalty-count">
                    {team.count > 0 ? (
                      <>
                        <span className="nba-count-badge">{team.count}</span>
                        штраф
                        {team.count === 1 ? "" : team.count > 4 ? "ов" : "а"}
                      </>
                    ) : (
                      "Нет штрафов"
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTeam && (
        <div className="nba-team-detail">
          <div className="nba-detail-header">
            <div className="nba-detail-title">
              <h3>{selectedTeam}</h3>
              <div className="nba-detail-subtitle">
                Штрафов: {getTeamPenalties(selectedTeam).length}
              </div>
            </div>
            <button
              className="nba-back-btn"
              onClick={() => setSelectedTeam(null)}
              disabled={loading}
            >
              <span className="nba-back-arrow">←</span>
              Назад к списку
            </button>
          </div>

          {getTeamPenalties(selectedTeam).length === 0 ? (
            <div className="nba-no-penalties-message">
              <div className="nba-no-penalties-icon">🏆</div>
              <p>У этой команды нет штрафов</p>
              <p className="nba-no-penalties-hint">
                Нажмите "Добавить штраф", чтобы создать первый
              </p>
            </div>
          ) : (
            <div className="nba-detail-list">
              {getTeamPenalties(selectedTeam).map((penalty) => (
                <div key={penalty.id} className="nba-detail-item">
                  <div className="nba-detail-item-header">
                    <div className="nba-detail-date">
                      <span className="nba-date-icon">📅</span>
                      {new Date(penalty.date).toLocaleDateString("ru-RU")}
                    </div>
                    <div className="nba-detail-id">#{penalty.id}</div>
                  </div>
                  <div className="nba-detail-description">
                    {penalty.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BodyPenalties;
