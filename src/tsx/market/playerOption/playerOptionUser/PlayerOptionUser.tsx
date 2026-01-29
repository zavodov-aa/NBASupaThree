// import React, { useEffect, useState } from "react";
// import { supabase } from "../../../../Supabase"; // Или путь к вашему клиенту Supabase

// interface MarketPO {
//   id: number;
//   name: string;
//   team: string;
//   salary: number;
//   result: string;
// }

// const PlayerOptionUser = () => {
//   const [data, setData] = useState<MarketPO[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const { data: marketData, error } = await supabase
//         .from("market_PO")
//         .select("id, name, team, salary, result")
//         .order("id", { ascending: true });

//       if (error) throw error;
//       setData(marketData || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ошибка загрузки");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функция для форматирования зарплаты
//   const formatSalary = (salary: number | string) => {
//     // Преобразуем в строку, если это еще не строка
//     const salaryStr = typeof salary === "string" ? salary : salary.toString();

//     // Убираем "PO-" префикс, если он есть
//     const cleanedSalary = salaryStr.replace(/^PO-/, "");

//     // Преобразуем в число и форматируем с разделителями тысяч
//     const num = parseFloat(cleanedSalary);

//     // Проверяем, что это валидное число
//     if (isNaN(num)) return cleanedSalary;

//     // Форматируем с разделителями тысяч (без привязки к валюте)
//     return num.toLocaleString("ru-RU", {
//       useGrouping: true,
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     });
//   };

//   if (loading) return <div>Загрузка...</div>;
//   if (error) return <div>Ошибка: {error}</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Таблица market_PO</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 p-2">#</th>
//               <th className="border border-gray-300 p-2">Имя</th>
//               <th className="border border-gray-300 p-2">Команда</th>
//               <th className="border border-gray-300 p-2">Зарплата</th>
//               <th className="border border-gray-300 p-2">Результат</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={item.id} className="hover:bg-gray-50">
//                 <td className="border border-gray-300 p-2">{index + 1}</td>
//                 <td className="border border-gray-300 p-2">{item.name}</td>
//                 <td className="border border-gray-300 p-2">{item.team}</td>
//                 <td className="border border-gray-300 p-2">
//                   {formatSalary(item.salary)}
//                 </td>
//                 <td className="border border-gray-300 p-2">{item.result}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PlayerOptionUser;

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../Supabase";
import "./playerOptionUser.css";

interface MarketPO {
  id: number;
  name: string;
  team: string;
  salary: number;
  result: string;
}

const PlayerOptionUser = () => {
  const [data, setData] = useState<MarketPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: marketData, error } = await supabase
        .from("market_PO")
        .select("id, name, team, salary, result")
        .order("id", { ascending: true });

      if (error) throw error;
      setData(marketData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary: number | string) => {
    const salaryStr = typeof salary === "string" ? salary : salary.toString();
    const cleanedSalary = salaryStr.replace(/^PO-/, "");
    const num = parseFloat(cleanedSalary);

    if (isNaN(num)) return cleanedSalary;

    return num.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const getResultClass = (result: string) => {
    const res = result.toLowerCase();
    if (res.includes("позитив") || res.includes("успех"))
      return "playerOptionUser__result--positive";
    if (res.includes("негатив") || res.includes("провал"))
      return "playerOptionUser__result--negative";
    return "playerOptionUser__result--neutral";
  };

  if (loading)
    return (
      <div className="playerOptionUser playerOptionUser--loading">
        Загрузка данных...
      </div>
    );
  if (error)
    return (
      <div className="playerOptionUser playerOptionUser--error">
        Ошибка: {error}
      </div>
    );

  return (
    <div className="playerOptionUser">
      <div className="playerOptionUser__header">
        <h1 className="playerOptionUser__title">Player Options Market</h1>
        <p className="playerOptionUser__subtitle">
          Обзор зарплат и результатов игроков
        </p>
      </div>

      <div className="playerOptionUser__table-wrapper">
        <table className="playerOptionUser__table">
          <thead>
            <tr>
              <th className="playerOptionUser__th">Игрок</th>
              <th className="playerOptionUser__th">Команда</th>
              <th className="playerOptionUser__th">Зарплата</th>
              <th className="playerOptionUser__th">Результат</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="playerOptionUser__tr">
                <td className="playerOptionUser__td">{item.name}</td>
                <td className="playerOptionUser__td">
                  <span className="playerOptionUser__team">{item.team}</span>
                </td>
                <td className="playerOptionUser__td">
                  ${formatSalary(item.salary)}
                </td>
                <td className="playerOptionUser__td">
                  <span
                    className={`playerOptionUser__result ${getResultClass(item.result)}`}
                  >
                    {item.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="playerOptionUser__footer">
        <div className="playerOptionUser__count">Записей: {data.length}</div>
        <button className="playerOptionUser__btn" onClick={fetchData}>
          Обновить
        </button>
      </div>
    </div>
  );
};

export default PlayerOptionUser;
