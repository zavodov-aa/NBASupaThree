// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../../Supabase";

// // Тип для данных из таблицы market_TO
// interface MarketTOData {
//   name: string;
//   team: string;
//   salary: number;
//   result: number;
// }

// // Тип для данных из таблицы Players
// interface PlayerData {
//   active_roster: string; // имя игрока
//   team: string;
// }

// // Тип для объединенных данных
// interface FilteredMarketData extends MarketTOData {
//   // Можно добавить дополнительные поля если нужно
// }

// // Функция для форматирования чисел с разделителями тысяч
// const formatNumber = (num: number): string => {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
// };

// // Стили
// const tableHeaderStyle: React.CSSProperties = {
//   padding: "12px",
//   borderBottom: "2px solid #ddd",
//   textAlign: "left",
//   fontWeight: "bold",
// };

// const tableCellStyle: React.CSSProperties = {
//   padding: "10px",
//   borderBottom: "1px solid #ddd",
// };

// const TeamOptionAdmin: React.FC = () => {
//   const [marketData, setMarketData] = useState<MarketTOData[]>([]);
//   const [activePlayers, setActivePlayers] = useState<PlayerData[]>([]);
//   const [filteredData, setFilteredData] = useState<FilteredMarketData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async (): Promise<void> => {
//     try {
//       setLoading(true);

//       // Загружаем данные из таблицы Players (колонки active_roster и team)
//       const { data: playersData, error: playersError } = await supabase
//         .from("Players")
//         .select("active_roster, team")
//         .not("active_roster", "is", null); // исключаем записи с пустым active_roster

//       if (playersError) throw playersError;
//       setActivePlayers(playersData || []);

//       // Загружаем данные из таблицы market_TO
//       const { data: marketData, error: marketError } = await supabase
//         .from("market_TO")
//         .select("name, team, salary, result");

//       if (marketError) throw marketError;
//       setMarketData(marketData || []);

//       // Создаем карту для быстрого поиска активных игроков по имени и команде
//       const activePlayersMap = new Map();
//       (playersData || []).forEach((player) => {
//         const key = `${player.active_roster}-${player.team}`;
//         activePlayersMap.set(key, true);
//       });

//       // Фильтруем данные из market_TO по активным игрокам
//       const filtered = (marketData || []).filter((marketItem) => {
//         const key = `${marketItem.name}-${marketItem.team}`;
//         return activePlayersMap.has(key);
//       });

//       setFilteredData(filtered);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Неизвестная ошибка";
//       setError(errorMessage);
//       console.error("Ошибка загрузки данных:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) return <div>Загрузка данных...</div>;
//   if (error) return <div>Ошибка: {error}</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3>Данные таблицы Market_TO (только активные игроки)</h3>
//       <div style={{ marginBottom: "10px" }}>
//         Найдено активных игроков: {activePlayers.length}
//         <br />
//         Отфильтровано записей: {filteredData.length} из {marketData.length}
//       </div>
//       {filteredData.length === 0 ? (
//         <div>Нет данных для отображения</div>
//       ) : (
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginTop: "10px",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: "#f2f2f2" }}>
//               <th style={tableHeaderStyle}>Имя</th>
//               <th style={tableHeaderStyle}>Команда</th>
//               <th style={tableHeaderStyle}>Зарплата</th>
//               <th style={tableHeaderStyle}>Результат</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item, index) => (
//               <tr
//                 key={`${item.name}-${index}`}
//                 style={{
//                   backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
//                 }}
//               >
//                 <td style={tableCellStyle}>{item.name}</td>
//                 <td style={tableCellStyle}>{item.team}</td>
//                 <td style={tableCellStyle}>{formatNumber(item.salary)}</td>
//                 <td style={tableCellStyle}>{item.result}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TeamOptionAdmin;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../../Supabase";
import "./teamOptionAdmin.css";

interface MarketTOData {
  name: string;
  team: string;
  salary: number;
  result: number;
}

interface PlayerData {
  active_roster: string;
  team: string;
}

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const TeamOptionAdmin: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketTOData[]>([]);
  const [activePlayers, setActivePlayers] = useState<PlayerData[]>([]);
  const [filteredData, setFilteredData] = useState<MarketTOData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data: playersData, error: playersError } = await supabase
        .from("Players")
        .select("active_roster, team")
        .not("active_roster", "is", null);

      if (playersError) throw playersError;
      setActivePlayers(playersData || []);

      const { data: marketData, error: marketError } = await supabase
        .from("market_TO")
        .select("name, team, salary, result");

      if (marketError) throw marketError;
      setMarketData(marketData || []);

      const activePlayersMap = new Map();
      (playersData || []).forEach((player) => {
        const key = `${player.active_roster}-${player.team}`;
        activePlayersMap.set(key, true);
      });

      const filtered = (marketData || []).filter((marketItem) => {
        const key = `${marketItem.name}-${marketItem.team}`;
        return activePlayersMap.has(key);
      });

      setFilteredData(filtered);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(errorMessage);
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="teamOptionAdminLoading">Загрузка...</div>;
  if (error) return <div className="teamOptionAdminError">Ошибка: {error}</div>;

  return (
    <div className="teamOptionAdmin">
      <div className="teamOptionAdminHeader">
        <h3 className="teamOptionAdminTitle">Market_TO (активные игроки)</h3>
        <div className="teamOptionAdminStats">
          Активных: {activePlayers.length} | Показано: {filteredData.length}/
          {marketData.length}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="teamOptionAdminEmpty">Нет данных</div>
      ) : (
        <div className="teamOptionAdminTableWrapper">
          <table className="teamOptionAdminTable">
            <thead>
              <tr>
                <th className="teamOptionAdminTh">Имя</th>
                <th className="teamOptionAdminTh">Команда</th>
                <th className="teamOptionAdminTh">Зарплата</th>
                <th className="teamOptionAdminTh">Результат</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={`${item.name}-${index}`} className="teamOptionAdminTr">
                  <td className="teamOptionAdminTd">{item.name}</td>
                  <td className="teamOptionAdminTd">{item.team}</td>
                  <td className="teamOptionAdminTd">
                    {formatNumber(item.salary)}
                  </td>
                  <td className="teamOptionAdminTd">{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamOptionAdmin;
