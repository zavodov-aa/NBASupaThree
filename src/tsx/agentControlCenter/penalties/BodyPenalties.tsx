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
//         (penalty) => penalty.team === team,
//       );
//       return {
//         name: team,
//         count: teamPenalties.length,
//       };
//     });
//     setTeamStats(stats);
//   };

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
//     <div className="penalties-container">
//       <div className="penalties-header-section">
//         <h1 className="penalties-main-title">Штрафы НБА</h1>
//         <button
//           className="penalties-add-penalty-btn"
//           onClick={handleAddPenalty}
//           disabled={loading}
//         >
//           + Добавить штраф
//         </button>
//       </div>

//       {error && (
//         <div className="penalties-error-message">
//           <span className="penalties-error-icon">⚠️</span> Ошибка: {error}
//         </div>
//       )}

//       {showForm && (
//         <div className="penalties-penalty-form">
//           <div className="penalties-form-header">
//             <h3>Добавление нового штрафа</h3>
//             <button
//               className="penalties-close-form-btn"
//               onClick={handleCancel}
//               disabled={loading}
//             >
//               ×
//             </button>
//           </div>
//           <div className="penalties-form-content">
//             <div className="penalties-form-group">
//               <label htmlFor="date">Дата *</label>
//               <input
//                 id="date"
//                 type="date"
//                 name="date"
//                 value={newPenalty.date}
//                 onChange={handleInputChange}
//                 required
//                 disabled={loading}
//                 max={new Date().toISOString().split("T")[0]}
//               />
//             </div>
//             <div className="penalties-form-group">
//               <label htmlFor="team">Команда</label>
//               <select
//                 id="team"
//                 name="team"
//                 value={newPenalty.team}
//                 onChange={handleInputChange}
//                 disabled={loading}
//               >
//                 <option value="">Выберите команду</option>
//                 {nbaTeams.map((team, index) => (
//                   <option key={index} value={team}>
//                     {team}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="penalties-form-group">
//               <label htmlFor="description">Описание *</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={newPenalty.description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 required
//                 disabled={loading}
//                 placeholder="Введите описание штрафа..."
//               />
//             </div>
//             <div className="penalties-form-actions">
//               <button
//                 className="penalties-save-btn"
//                 onClick={handleSavePenalty}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="penalties-loading-spinner"></span>
//                     Сохранение...
//                   </>
//                 ) : (
//                   "Сохранить"
//                 )}
//               </button>
//               <button
//                 className="penalties-cancel-btn"
//                 onClick={handleCancel}
//                 disabled={loading}
//               >
//                 Отмена
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="penalties-teams-overview">
//         <div className="penalties-overview-header">
//           <h3>Команды НБА ({teamStats.length})</h3>
//           <div className="penalties-stats-summary">
//             Всего штрафов: {penalties.length}
//           </div>
//         </div>

//         {loading && !penalties.length ? (
//           <div className="penalties-loading-container">
//             <div className="penalties-loading-spinner-large"></div>
//             <p>Загрузка данных...</p>
//           </div>
//         ) : (
//           <div className="penalties-teams-grid">
//             {teamStats.map((team) => (
//               <div
//                 key={team.name}
//                 className={`penalties-team-card ${
//                   selectedTeam === team.name ? "penalties-team-selected" : ""
//                 } ${team.count > 0 ? "penalties-has-penalties" : "penalties-no-penalties"}`}
//                 onClick={() => handleTeamClick(team.name)}
//                 role="button"
//                 tabIndex={0}
//                 onKeyPress={(e) =>
//                   e.key === "Enter" && handleTeamClick(team.name)
//                 }
//               >
//                 <div className="penalties-team-logo-placeholder">
//                   {team.name.charAt(0)}
//                 </div>
//                 <div className="penalties-team-content">
//                   <div className="penalties-team-name">{team.name}</div>
//                   <div className="penalties-team-penalty-count">
//                     {team.count > 0 ? (
//                       <>
//                         <span className="penalties-count-badge">
//                           {team.count}
//                         </span>
//                         штраф
//                         {team.count === 1 ? "" : team.count > 4 ? "ов" : "а"}
//                       </>
//                     ) : (
//                       "Нет штрафов"
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {selectedTeam && (
//         <div className="penalties-team-detail">
//           <div className="penalties-detail-header">
//             <div className="penalties-detail-title">
//               <h3>{selectedTeam}</h3>
//               <div className="penalties-detail-subtitle">
//                 Штрафов: {getTeamPenalties(selectedTeam).length}
//               </div>
//             </div>
//             <button
//               className="penalties-back-btn"
//               onClick={() => setSelectedTeam(null)}
//               disabled={loading}
//             >
//               <span className="penalties-back-arrow">←</span>
//               Назад к списку
//             </button>
//           </div>

//           {getTeamPenalties(selectedTeam).length === 0 ? (
//             <div className="penalties-no-penalties-message">
//               <div className="penalties-no-penalties-icon">🏆</div>
//               <p>У этой команды нет штрафов</p>
//               <p className="penalties-no-penalties-hint">
//                 Нажмите "Добавить штраф", чтобы создать первый
//               </p>
//             </div>
//           ) : (
//             <div className="penalties-detail-list">
//               {getTeamPenalties(selectedTeam).map((penalty) => (
//                 <div key={penalty.id} className="penalties-detail-item">
//                   <div className="penalties-detail-item-header">
//                     <div className="penalties-detail-date">
//                       <span className="penalties-date-icon">📅</span>
//                       {new Date(penalty.date).toLocaleDateString("ru-RU")}
//                     </div>
//                     <div className="penalties-detail-id">#{penalty.id}</div>
//                   </div>
//                   <div className="penalties-detail-description">
//                     {penalty.description}
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
  const [editingPenalty, setEditingPenalty] = useState<Penalty | null>(null); // Редактируемый штраф

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
        (penalty) => penalty.team === team,
      );
      return {
        name: team,
        count: teamPenalties.length,
      };
    });
    setTeamStats(stats);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewPenalty({
      ...newPenalty,
      [name]: value,
    });
  };

  const handleAddPenalty = () => {
    setEditingPenalty(null);
    setNewPenalty({ date: "", team: "", description: "" });
    setShowForm(true);
    setSelectedTeam(null);
  };

  const handleEditPenalty = (penalty: Penalty) => {
    setEditingPenalty(penalty);
    setNewPenalty({
      date: penalty.date,
      team: penalty.team,
      description: penalty.description,
    });
    setShowForm(true);
  };

  const handleSavePenalty = async () => {
    if (!newPenalty.date || !newPenalty.description) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingPenalty) {
        // Обновление существующего штрафа
        const { error } = await supabase
          .from("Penalties")
          .update({
            date: newPenalty.date,
            team: newPenalty.team,
            description: newPenalty.description,
          })
          .eq("id", editingPenalty.id);

        if (error) throw error;

        // Обновляем локальное состояние
        setPenalties((prevPenalties) =>
          prevPenalties.map((p) =>
            p.id === editingPenalty.id ? { ...p, ...newPenalty } : p,
          ),
        );
        alert("Штраф успешно обновлён");
      } else {
        // Создание нового штрафа
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
          alert("Штраф успешно добавлен");
        }
      }

      setNewPenalty({ date: "", team: "", description: "" });
      setShowForm(false);
      setEditingPenalty(null);
    } catch (err: any) {
      console.error("Ошибка при сохранении штрафа:", err);
      setError(err.message || "Не удалось сохранить штраф");
      alert("Ошибка при сохранении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePenalty = async (penaltyId: number) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этот штраф?",
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("Penalties")
        .delete()
        .eq("id", penaltyId);

      if (error) throw error;

      setPenalties((prevPenalties) =>
        prevPenalties.filter((p) => p.id !== penaltyId),
      );
      alert("Штраф удалён");
    } catch (err: any) {
      console.error("Ошибка при удалении штрафа:", err);
      setError(err.message || "Не удалось удалить штраф");
      alert("Ошибка при удалении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTeam(null);
    setEditingPenalty(null);
    setNewPenalty({ date: "", team: "", description: "" });
    setError(null);
  };

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName);
    setShowForm(false);
    setEditingPenalty(null);
  };

  const getTeamPenalties = (teamName: string) => {
    return penalties.filter((penalty) => penalty.team === teamName);
  };

  return (
    <div className="penalties-container">
      <div className="penalties-header-section">
        <h1 className="penalties-main-title">Штрафы НБА</h1>
        <button
          className="penalties-add-penalty-btn"
          onClick={handleAddPenalty}
          disabled={loading}
        >
          + Добавить штраф
        </button>
      </div>

      {error && (
        <div className="penalties-error-message">
          <span className="penalties-error-icon">⚠️</span> Ошибка: {error}
        </div>
      )}

      {showForm && (
        <div className="penalties-penalty-form">
          <div className="penalties-form-header">
            <h3>
              {editingPenalty
                ? "Редактирование штрафа"
                : "Добавление нового штрафа"}
            </h3>
            <button
              className="penalties-close-form-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              ×
            </button>
          </div>
          <div className="penalties-form-content">
            <div className="penalties-form-group">
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
            <div className="penalties-form-group">
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
            <div className="penalties-form-group">
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
            <div className="penalties-form-actions">
              <button
                className="penalties-save-btn"
                onClick={handleSavePenalty}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="penalties-loading-spinner"></span>
                    {editingPenalty ? "Обновление..." : "Сохранение..."}
                  </>
                ) : editingPenalty ? (
                  "Обновить"
                ) : (
                  "Сохранить"
                )}
              </button>
              <button
                className="penalties-cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="penalties-teams-overview">
        <div className="penalties-overview-header">
          <h3>Команды НБА ({teamStats.length})</h3>
          <div className="penalties-stats-summary">
            Всего штрафов: {penalties.length}
          </div>
        </div>

        {loading && !penalties.length ? (
          <div className="penalties-loading-container">
            <div className="penalties-loading-spinner-large"></div>
            <p>Загрузка данных...</p>
          </div>
        ) : (
          <div className="penalties-teams-grid">
            {teamStats.map((team) => (
              <div
                key={team.name}
                className={`penalties-team-card ${
                  selectedTeam === team.name ? "penalties-team-selected" : ""
                } ${team.count > 0 ? "penalties-has-penalties" : "penalties-no-penalties"}`}
                onClick={() => handleTeamClick(team.name)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleTeamClick(team.name)
                }
              >
                <div className="penalties-team-logo-placeholder">
                  {team.name.charAt(0)}
                </div>
                <div className="penalties-team-content">
                  <div className="penalties-team-name">{team.name}</div>
                  <div className="penalties-team-penalty-count">
                    {team.count > 0 ? (
                      <>
                        <span className="penalties-count-badge">
                          {team.count}
                        </span>
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
        <div className="penalties-team-detail">
          <div className="penalties-detail-header">
            <div className="penalties-detail-title">
              <h3>{selectedTeam}</h3>
              <div className="penalties-detail-subtitle">
                Штрафов: {getTeamPenalties(selectedTeam).length}
              </div>
            </div>
            <button
              className="penalties-back-btn"
              onClick={() => setSelectedTeam(null)}
              disabled={loading}
            >
              <span className="penalties-back-arrow">←</span>
              Назад к списку
            </button>
          </div>

          {getTeamPenalties(selectedTeam).length === 0 ? (
            <div className="penalties-no-penalties-message">
              <div className="penalties-no-penalties-icon">🏆</div>
              <p>У этой команды нет штрафов</p>
              <p className="penalties-no-penalties-hint">
                Нажмите "Добавить штраф", чтобы создать первый
              </p>
            </div>
          ) : (
            <div className="penalties-detail-list">
              {getTeamPenalties(selectedTeam).map((penalty) => (
                <div key={penalty.id} className="penalties-detail-item">
                  <div className="penalties-detail-item-header">
                    <div className="penalties-detail-date">
                      <span className="penalties-date-icon">📅</span>
                      {new Date(penalty.date).toLocaleDateString("ru-RU")}
                    </div>
                    <div className="penalties-detail-actions">
                      <button
                        className="penalties-edit-btn"
                        onClick={() => handleEditPenalty(penalty)}
                        disabled={loading}
                        title="Редактировать"
                      >
                        ✏️ Редактировать
                      </button>
                      <button
                        className="penalties-delete-btn"
                        onClick={() => handleDeletePenalty(penalty.id)}
                        disabled={loading}
                        title="Удалить"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                    <div className="penalties-detail-id">#{penalty.id}</div>
                  </div>
                  <div className="penalties-detail-description">
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
