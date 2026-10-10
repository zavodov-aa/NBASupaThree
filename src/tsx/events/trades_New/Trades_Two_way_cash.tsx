// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";

// interface CashData {
//   amount: number;
//   direction: "myToTheir" | "theirToMy";
// }

// interface Trades_Two_way_cashProps {
//   myTeam: string;
//   theirTeam: string;
//   onBack: () => void;
//   onSubmit: (cashData: CashData) => void;
//   initialCash?: CashData;
// }

// const Trades_Two_way_cash: React.FC<Trades_Two_way_cashProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onSubmit,
//   initialCash = { amount: 0, direction: "myToTheir" },
// }) => {
//   const [myCash, setMyCash] = useState<number>(0);
//   const [theirCash, setTheirCash] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [warning, setWarning] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Строковые значения для полей ввода (пустая строка = 0)
//   const [myToTheirInput, setMyToTheirInput] = useState<string>(() => {
//     if (initialCash.direction === "myToTheir" && initialCash.amount !== 0) {
//       return String(initialCash.amount);
//     }
//     return "";
//   });
//   const [theirToMyInput, setTheirToMyInput] = useState<string>(() => {
//     if (initialCash.direction === "theirToMy" && initialCash.amount !== 0) {
//       return String(initialCash.amount);
//     }
//     return "";
//   });

//   // Числовые значения для расчётов (пустая строка -> 0)
//   const myToTheirAmount = myToTheirInput === "" ? 0 : Number(myToTheirInput);
//   const theirToMyAmount = theirToMyInput === "" ? 0 : Number(theirToMyInput);

//   useEffect(() => {
//     const fetchCashForTeam = async (
//       teamName: string,
//     ): Promise<number | null> => {
//       const { data, error } = await supabase
//         .from("Head")
//         .select("cash_money")
//         .eq("team_name", teamName)
//         .maybeSingle();

//       if (error) {
//         console.error(`Ошибка загрузки cash_money для ${teamName}:`, error);
//         throw error;
//       }
//       return data?.cash_money ?? null;
//     };

//     const loadCash = async () => {
//       setLoading(true);
//       setError(null);
//       setWarning(null);
//       try {
//         const [myRaw, theirRaw] = await Promise.all([
//           fetchCashForTeam(myTeam),
//           fetchCashForTeam(theirTeam),
//         ]);

//         const myValue = myRaw !== null ? myRaw : 0;
//         const theirValue = theirRaw !== null ? theirRaw : 0;

//         setMyCash(myValue);
//         setTheirCash(theirValue);

//         if (myRaw === null)
//           setWarning(`Для команды "${myTeam}" cash не указан, используется 0`);
//         if (theirRaw === null)
//           setWarning(
//             `Для команды "${theirTeam}" cash не указан, используется 0`,
//           );
//       } catch (err) {
//         setError("Не удалось загрузить данные о денежных средствах команд");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (myTeam && theirTeam) {
//       loadCash();
//     }
//   }, [myTeam, theirTeam]);

//   // Проверка достаточности средств
//   const isMyToTheirValid = myToTheirAmount >= 0 && myCash >= myToTheirAmount;
//   const isTheirToMyValid = theirToMyAmount >= 0 && theirCash >= theirToMyAmount;
//   const isValid = isMyToTheirValid && isTheirToMyValid;

//   // Вычисление чистого перевода для старого onSubmit
//   const getNetTransfer = (): CashData | null => {
//     if (myToTheirAmount > theirToMyAmount) {
//       return {
//         amount: myToTheirAmount - theirToMyAmount,
//         direction: "myToTheir",
//       };
//     } else if (theirToMyAmount > myToTheirAmount) {
//       return {
//         amount: theirToMyAmount - myToTheirAmount,
//         direction: "theirToMy",
//       };
//     } else {
//       return { amount: 0, direction: "myToTheir" };
//     }
//   };

//   const handleSubmit = () => {
//     if (isValid) {
//       const net = getNetTransfer();
//       if (net) onSubmit(net);
//     }
//   };

//   // Итоговые суммы после сделки
//   const finalMyCash = myCash - myToTheirAmount + theirToMyAmount;
//   const finalTheirCash = theirCash - theirToMyAmount + myToTheirAmount;

//   if (loading) return <div>Загрузка данных о командах...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="Trades-Two-way-cash">
//       <div className="Trades-Two-way-teams">
//         <strong>Трейд между командами:</strong> {myTeam} ↔ {theirTeam}
//       </div>

//       {warning && (
//         <div className="warning" style={{ color: "orange" }}>
//           {warning}
//         </div>
//       )}

//       <div className="Trades-Two-way-current-cash">
//         <div>
//           {myTeam}: {myCash.toLocaleString()}
//         </div>
//         <div>
//           {theirTeam}: {theirCash.toLocaleString()}
//         </div>
//       </div>

//       <div className="Trades-Two-way-cash-field">
//         <label>
//           {myTeam} → {theirTeam}:
//         </label>
//         <input
//           type="number"
//           min="0"
//           step="1000"
//           placeholder="0"
//           value={myToTheirInput}
//           onChange={(e) => setMyToTheirInput(e.target.value)}
//         />
//         {!isMyToTheirValid && myToTheirAmount > 0 && (
//           <div style={{ color: "red", fontSize: "0.8em" }}>
//             Недостаточно cash (доступно {myCash.toLocaleString()})
//           </div>
//         )}
//       </div>

//       <div className="Trades-Two-way-cash-field">
//         <label>
//           {theirTeam} → {myTeam}:
//         </label>
//         <input
//           type="number"
//           min="0"
//           step="1000"
//           placeholder="0"
//           value={theirToMyInput}
//           onChange={(e) => setTheirToMyInput(e.target.value)}
//         />
//         {!isTheirToMyValid && theirToMyAmount > 0 && (
//           <div style={{ color: "red", fontSize: "0.8em" }}>
//             Недостаточно cash (доступно {theirCash.toLocaleString()})
//           </div>
//         )}
//       </div>

//       <div className="Trades-Two-way-result">
//         <div>
//           <strong>После сделки:</strong>
//         </div>
//         <div>
//           {myTeam}: {finalMyCash.toLocaleString()}
//         </div>
//         <div>
//           {theirTeam}: {finalTheirCash.toLocaleString()}
//         </div>
//       </div>

//       <div style={{ fontSize: "0.85em", marginTop: "8px", color: "#555" }}>
//         Чистый перевод:{" "}
//         {getNetTransfer()?.direction === "myToTheir"
//           ? `${myTeam} → ${theirTeam}`
//           : `${theirTeam} → ${myTeam}`}{" "}
//         на сумму {getNetTransfer()?.amount.toLocaleString()}
//       </div>

//       <div className="Trades-Two-way-actions">
//         <button className="Trades-Two-way-back" onClick={onBack}>
//           Назад
//         </button>
//         <button
//           className="Trades-Two-way-next"
//           onClick={handleSubmit}
//           disabled={!isValid}
//         >
//           Далее
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_cash;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades_Two_way_cash.css";

interface CashData {
  amount: number;
  direction: "myToTheir" | "theirToMy";
}

interface Trades_Two_way_cashProps {
  myTeam: string;
  theirTeam: string;
  onBack: () => void;
  onSubmit: (cashData: CashData) => void;
  initialCash?: CashData;
}

const Trades_Two_way_cash: React.FC<Trades_Two_way_cashProps> = ({
  myTeam,
  theirTeam,
  onBack,
  onSubmit,
  initialCash = { amount: 0, direction: "myToTheir" },
}) => {
  const [myCash, setMyCash] = useState<number>(0);
  const [theirCash, setTheirCash] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [myToTheirInput, setMyToTheirInput] = useState<string>(() => {
    if (initialCash.direction === "myToTheir" && initialCash.amount !== 0) {
      return String(initialCash.amount);
    }
    return "";
  });
  const [theirToMyInput, setTheirToMyInput] = useState<string>(() => {
    if (initialCash.direction === "theirToMy" && initialCash.amount !== 0) {
      return String(initialCash.amount);
    }
    return "";
  });

  const myToTheirAmount = myToTheirInput === "" ? 0 : Number(myToTheirInput);
  const theirToMyAmount = theirToMyInput === "" ? 0 : Number(theirToMyInput);

  useEffect(() => {
    const fetchCashForTeam = async (
      teamName: string,
    ): Promise<number | null> => {
      const { data, error } = await supabase
        .from("Head")
        .select("cash_money")
        .eq("team_name", teamName)
        .maybeSingle();

      if (error) {
        console.error(`Ошибка загрузки cash_money для ${teamName}:`, error);
        throw error;
      }
      return data?.cash_money ?? null;
    };

    const loadCash = async () => {
      setLoading(true);
      setError(null);
      setWarning(null);
      try {
        const [myRaw, theirRaw] = await Promise.all([
          fetchCashForTeam(myTeam),
          fetchCashForTeam(theirTeam),
        ]);

        const myValue = myRaw !== null ? myRaw : 0;
        const theirValue = theirRaw !== null ? theirRaw : 0;

        setMyCash(myValue);
        setTheirCash(theirValue);

        if (myRaw === null)
          setWarning(`Для команды "${myTeam}" cash не указан, используется 0`);
        if (theirRaw === null)
          setWarning(
            `Для команды "${theirTeam}" cash не указан, используется 0`,
          );
      } catch (err) {
        setError("Не удалось загрузить данные о денежных средствах команд");
      } finally {
        setLoading(false);
      }
    };

    if (myTeam && theirTeam) {
      loadCash();
    }
  }, [myTeam, theirTeam]);

  const isMyToTheirValid = myToTheirAmount >= 0 && myCash >= myToTheirAmount;
  const isTheirToMyValid = theirToMyAmount >= 0 && theirCash >= theirToMyAmount;
  const isValid = isMyToTheirValid && isTheirToMyValid;

  const getNetTransfer = (): CashData | null => {
    if (myToTheirAmount > theirToMyAmount) {
      return {
        amount: myToTheirAmount - theirToMyAmount,
        direction: "myToTheir",
      };
    } else if (theirToMyAmount > myToTheirAmount) {
      return {
        amount: theirToMyAmount - myToTheirAmount,
        direction: "theirToMy",
      };
    } else {
      return { amount: 0, direction: "myToTheir" };
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      const net = getNetTransfer();
      if (net) onSubmit(net);
    }
  };

  const finalMyCash = myCash - myToTheirAmount + theirToMyAmount;
  const finalTheirCash = theirCash - theirToMyAmount + myToTheirAmount;

  if (loading)
    return <div className="loader">Загрузка данных о командах...</div>;
  if (error) return <div className="error-box">{error}</div>;

  return (
    <div className="trade-cash-card">
      <h3 className="trade-title">
        Трейд между командами: {myTeam} ↔ {theirTeam}
      </h3>

      {warning && <div className="warning">⚠️ {warning}</div>}

      <div className="current-cash">
        <div className="cash-item">
          <span className="team-name">{myTeam}</span>
          <span className="cash-amount">{myCash.toLocaleString()} ₽</span>
        </div>
        <div className="cash-item">
          <span className="team-name">{theirTeam}</span>
          <span className="cash-amount">{theirCash.toLocaleString()} ₽</span>
        </div>
      </div>

      <div className="inputs-grid">
        <div className="input-group">
          <label className="label">
            {myTeam} → {theirTeam}
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="0"
            value={myToTheirInput}
            onChange={(e) => setMyToTheirInput(e.target.value)}
            className="cash-input"
          />
          {!isMyToTheirValid && myToTheirAmount > 0 && (
            <div className="error-text">
              Недостаточно cash (доступно {myCash.toLocaleString()})
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="label">
            {theirTeam} → {myTeam}
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="0"
            value={theirToMyInput}
            onChange={(e) => setTheirToMyInput(e.target.value)}
            className="cash-input"
          />
          {!isTheirToMyValid && theirToMyAmount > 0 && (
            <div className="error-text">
              Недостаточно cash (доступно {theirCash.toLocaleString()})
            </div>
          )}
        </div>
      </div>

      <div className="result-card">
        <div className="result-title">После сделки</div>
        <div className="result-row">
          <span>{myTeam}:</span>
          <strong>{finalMyCash.toLocaleString()} ₽</strong>
        </div>
        <div className="result-row">
          <span>{theirTeam}:</span>
          <strong>{finalTheirCash.toLocaleString()} ₽</strong>
        </div>
        <div className="net-info">
          Чистый перевод:{" "}
          {getNetTransfer()?.direction === "myToTheir"
            ? `${myTeam} → ${theirTeam}`
            : `${theirTeam} → ${myTeam}`}{" "}
          на сумму {getNetTransfer()?.amount.toLocaleString()} ₽
        </div>
      </div>

      <div className="actions">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
        <button
          className="next-button"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Далее →
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_cash;
