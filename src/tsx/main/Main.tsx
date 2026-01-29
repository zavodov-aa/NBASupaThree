// import React, { useState } from "react";
// import logo from "../../img/LogoLeague4kFinal.png";
// import quest from "../../img/quest4kf.png";
// import "./main.css";
// import { Link, Route } from "react-router-dom";
// import { supabase } from "../../Supabase"; // Импорт клиента Supabase

// interface Team {
//   id: string;
//   name: string;
//   route?: string;
// }

// interface ConsoleItem {
//   id: string;
//   name: string;
//   route: string;
// }

// interface EventsLeague {
//   id: string;
//   name: string;
//   route?: string;
// }

// type TabType = "teams" | "console" | "reserve";

// interface FeedbackData {
//   date: string;
//   errors: string;
//   offers: string;
// }

// const Main: React.FC = () => {
//   // Массив команд с правильным типом
//   const teams: Team[] = [
//     { id: "hawks", name: "Atlanta Hawks", route: "/hawks" },
//     { id: "celtics", name: "Boston Celtics", route: "/celtics" },
//     { id: "nets", name: "Brooklyn Nets", route: "/nets" },
//     { id: "hornets", name: "Charlotte Hornets", route: "/hornets" },
//     { id: "bulls", name: "Chicago Bulls", route: "/bulls" },
//     { id: "cavaliers", name: "Cleveland Cavaliers", route: "/cavalers" },
//     { id: "mavericks", name: "Dallas Mavericks", route: "/mavericks" },
//     { id: "nuggets", name: "Denver Nuggets", route: "/nuggets" },
//     { id: "pistons", name: "Detroit Pistons", route: "/pistons" },
//     { id: "warriors", name: "Golden State Warriors", route: "/warriors" },
//     { id: "rockets", name: "Houston Rockets", route: "/rockets" },
//     { id: "pacers", name: "Indiana Pacers", route: "/pacers" },
//     { id: "clippers", name: "Los Angeles Clippers", route: "/clippers" },
//     {
//       id: "lakers",
//       name: "Los Angeles Lakers",
//       route: "/lakers", // Указываем путь для Lakers
//     },
//     { id: "grizzlies", name: "Memphis Grizzlies", route: "/grizzlies" },
//     { id: "heat", name: "Miami Heat", route: "/heat" },
//     { id: "bucks", name: "Milwaukee Bucks", route: "/bucks" },
//     {
//       id: "timberwolves",
//       name: "Minnesota Timberwolves",
//       route: "/timberwolves",
//     },
//     { id: "pelicans", name: "New Orleans Pelicans", route: "/pelicans" },
//     { id: "knicks", name: "New York Knicks", route: "/knicks" },
//     { id: "thunder", name: "Oklahoma City Thunder", route: "/thunder" },
//     { id: "magic", name: "Orlando Magic", route: "/magic" },
//     { id: "sixers", name: "Philadelphia 76ers", route: "/sevsix" },
//     { id: "suns", name: "Phoenix Suns", route: "/suns" },
//     { id: "blazers", name: "Portland Trail Blazers", route: "/blazers" },
//     { id: "kings", name: "Sacramento Kings", route: "/kings" },
//     { id: "spurs", name: "San Antonio Spurs", route: "/spurs" },
//     { id: "raptors", name: "Toronto Raptors", route: "/raptors" },
//     { id: "jazz", name: "Utah Jazz", route: "/jazz" },
//     { id: "wizards", name: "Washington Wizards", route: "/wizards" },
//   ];
//   const consoleCom: ConsoleItem[] = [
//     { id: "head", name: "Head Info", route: "/headInfoAgentControlCenter" },
//     {
//       id: "roster",
//       name: "Team Roster",
//       route: "/playersRosterAgentControlCenter",
//     },
//     { id: "dead", name: "Dead Cap", route: "/deadCapRosterAgentControl" },
//     { id: "logs", name: "Logs", route: "/logs" },
//     { id: "penalties", name: "Penalties", route: "/penalties" },
//   ];

//   const eventsLeague: EventsLeague[] = [
//     { id: "mainTournament", name: "Tournament", route: "/mainTournament" },
//     { id: "tradesAll", name: "Trades", route: "/tradesAll" },
//   ];

//   const [activeTab, setActiveTab] = useState<TabType>("teams");
//   const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
//   const [feedbackData, setFeedbackData] = useState<FeedbackData>({
//     date: "",
//     errors: "",
//     offers: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");

//   // Обработчик изменения полей формы
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFeedbackData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmitFeedback = async () => {
//     // Валидация
//     if (!feedbackData.date) {
//       setSubmitMessage("Пожалуйста, заполните поле даты");
//       setTimeout(() => setSubmitMessage(""), 3000);
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitMessage("");

//     try {
//       console.log("Подготовка данных для отправки:", {
//         date: feedbackData.date,
//         errors: feedbackData.errors.substring(0, 50) + "...",
//         offers: feedbackData.offers.substring(0, 50) + "...",
//       });

//       // Отправляем данные в Supabase
//       const { data, error } = await supabase.from("Questions").insert([
//         {
//           date: feedbackData.date,
//           errors: feedbackData.errors || null,
//           offers: feedbackData.offers || null,
//           // created_at добавится автоматически
//         },
//       ]);

//       if (error) {
//         console.error("Ошибка Supabase:", {
//           message: error.message,
//           code: error.code,
//           details: error.details,
//           hint: error.hint,
//         });

//         // Проверяем типичные ошибки
//         if (error.code === "42501") {
//           throw new Error(
//             "Ошибка прав доступа. Проверьте RLS политики в Supabase.",
//           );
//         } else if (error.code === "42P01") {
//           throw new Error(
//             'Таблица "Questions" не найдена. Создайте ее в Supabase.',
//           );
//         } else if (error.message.includes("JWT")) {
//           throw new Error(
//             "Неверный API ключ. Проверьте REACT_APP_SUPABASE_ANON_KEY.",
//           );
//         } else {
//           throw error;
//         }
//       }

//       console.log("✅ Данные успешно отправлены:", data);
//       setSubmitMessage("✅ Спасибо! Ваш отзыв сохранен.");

//       // Сброс формы и закрытие меню через 2 секунды
//       setTimeout(() => {
//         setFeedbackData({ date: "", errors: "", offers: "" });
//         setShowFeedbackMenu(false);
//         setSubmitMessage("");
//       }, 2000);
//     } catch (error: any) {
//       console.error("Полная ошибка:", error);

//       let errorMessage = "Произошла ошибка при сохранении";

//       if (error.message.includes("RLS")) {
//         errorMessage =
//           "Ошибка доступа. Проверьте RLS политики в Supabase Dashboard.";
//       } else if (error.message.includes("Таблица")) {
//         errorMessage =
//           "Таблица не найдена. Создайте таблицу 'Questions' в Supabase.";
//       } else if (error.message.includes("API ключ")) {
//         errorMessage =
//           "Проблема с API ключом. Проверьте настройки в файле .env";
//       }

//       setSubmitMessage(`❌ ${errorMessage}`);
//       setTimeout(() => setSubmitMessage(""), 5000);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Обработчик закрытия меню
//   const handleCloseMenu = () => {
//     setShowFeedbackMenu(false);
//     setFeedbackData({ date: "", errors: "", offers: "" });
//     setSubmitMessage("");
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "teams":
//         return (
//           <div className="teams-content">
//             {teams.map((team) => {
//               if (team.route) {
//                 return (
//                   <Link to={team.route} key={team.id} className="team-link">
//                     <div className="team-card">
//                       <h3>{team.name}</h3>
//                     </div>
//                   </Link>
//                 );
//               }
//               return (
//                 <div className="team-card" key={team.id}>
//                   <h3>{team.name}</h3>
//                 </div>
//               );
//             })}
//           </div>
//         );
//       case "console":
//         return (
//           <div className="console-content">
//             {consoleCom.map((ConsoleItem) => {
//               if (ConsoleItem.route) {
//                 return (
//                   <Link
//                     to={ConsoleItem.route}
//                     key={ConsoleItem.id}
//                     className="console-link"
//                   >
//                     <div className="console-card">
//                       <h3>{ConsoleItem.name}</h3>
//                     </div>
//                   </Link>
//                 );
//               }
//               return (
//                 <div className="console-card" key={ConsoleItem.id}>
//                   <h3>{ConsoleItem.name}</h3>
//                 </div>
//               );
//             })}
//           </div>
//         );
//       case "reserve":
//         return (
//           <div className="reserve-content">
//             {eventsLeague.map((event) => {
//               if (event.route) {
//                 return (
//                   <Link
//                     to={event.route}
//                     key={event.id}
//                     className="reserve-link"
//                   >
//                     <div className="reserve-card">
//                       <h3>{event.name}</h3>
//                     </div>
//                   </Link>
//                 );
//               }
//               return (
//                 <div className="reserve-card" key={event.id}>
//                   <h3>{event.name}</h3>
//                 </div>
//               );
//             })}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="main">
//       {/* Контекстное меню обратной связи */}
//       {showFeedbackMenu && (
//         <div className="feedback-overlay" onClick={handleCloseMenu}>
//           <div className="feedback-menu" onClick={(e) => e.stopPropagation()}>
//             <h3>Обратная связь</h3>

//             <div className="feedback-form">
//               <div className="form-group">
//                 <label htmlFor="date">Дата:</label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={feedbackData.date}
//                   onChange={handleInputChange}
//                   className="form-input"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="errors">Ошибки:</label>
//                 <textarea
//                   id="errors"
//                   name="errors"
//                   value={feedbackData.errors}
//                   onChange={handleInputChange}
//                   className="form-textarea"
//                   placeholder="Опишите найденные ошибки..."
//                   rows={4}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="offers">Предложения:</label>
//                 <textarea
//                   id="offers"
//                   name="offers"
//                   value={feedbackData.offers}
//                   onChange={handleInputChange}
//                   className="form-textarea"
//                   placeholder="Ваши предложения по улучшению..."
//                   rows={4}
//                 />
//               </div>

//               {submitMessage && (
//                 <div
//                   className={`submit-message ${
//                     submitMessage.includes("ошибка") ? "error" : "success"
//                   }`}
//                 >
//                   {submitMessage}
//                 </div>
//               )}

//               <div className="feedback-buttons">
//                 <button
//                   onClick={handleSubmitFeedback}
//                   className="save-btn"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Сохранение..." : "Сохранить"}
//                 </button>
//                 <button
//                   onClick={handleCloseMenu}
//                   className="close-btn"
//                   disabled={isSubmitting}
//                 >
//                   Закрыть
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="headerMain">
//         <img className="logo" src={logo} alt="League Logo" />
//         <h1>
//           NBA <span>Fantasy</span> League <span>Flshng</span> Lights
//         </h1>
//         <div className="quest-wrapper">
//           <img
//             className="quest"
//             src={quest}
//             alt="Quest Icon"
//             onClick={() => setShowFeedbackMenu(true)}
//             style={{ cursor: "pointer" }}
//           />
//           <span className="quest-tooltip">Обратная связь</span>
//         </div>
//       </div>

//       <div className="tabs-container">
//         <div className="tabs">
//           <button
//             className={`tab ${activeTab === "teams" ? "active" : ""}`}
//             onClick={() => setActiveTab("teams")}
//           >
//             Команды
//           </button>
//           <button
//             className={`tab ${activeTab === "console" ? "active" : ""}`}
//             onClick={() => setActiveTab("console")}
//           >
//             Консоль комиссионера
//           </button>
//           <button
//             className={`tab ${activeTab === "reserve" ? "active" : ""}`}
//             onClick={() => setActiveTab("reserve")}
//           >
//             События
//           </button>
//         </div>
//       </div>

//       <div className="body">{renderContent()}</div>
//     </div>
//   );
// };

// export default Main;

import React, { useState } from "react";
import logo from "../../img/LogoLeague4kFinal.png";
import quest from "../../img/quest4kf.png";
import "./main.css";
import { Link, Route } from "react-router-dom";
import { supabase } from "../../Supabase"; // Импорт клиента Supabase

interface Team {
  id: string;
  name: string;
  route?: string;
}

interface ConsoleItem {
  id: string;
  name: string;
  route: string;
}

interface EventsLeague {
  id: string;
  name: string;
  route?: string;
}

interface MarketItem {
  id: string;
  name: string;
  route: string;
}

type TabType = "teams" | "console" | "reserve" | "market";

interface FeedbackData {
  date: string;
  errors: string;
  offers: string;
}

const Main: React.FC = () => {
  // Массив команд с правильным типом
  const teams: Team[] = [
    { id: "hawks", name: "Atlanta Hawks", route: "/hawks" },
    { id: "celtics", name: "Boston Celtics", route: "/celtics" },
    { id: "nets", name: "Brooklyn Nets", route: "/nets" },
    { id: "hornets", name: "Charlotte Hornets", route: "/hornets" },
    { id: "bulls", name: "Chicago Bulls", route: "/bulls" },
    { id: "cavaliers", name: "Cleveland Cavaliers", route: "/cavalers" },
    { id: "mavericks", name: "Dallas Mavericks", route: "/mavericks" },
    { id: "nuggets", name: "Denver Nuggets", route: "/nuggets" },
    { id: "pistons", name: "Detroit Pistons", route: "/pistons" },
    { id: "warriors", name: "Golden State Warriors", route: "/warriors" },
    { id: "rockets", name: "Houston Rockets", route: "/rockets" },
    { id: "pacers", name: "Indiana Pacers", route: "/pacers" },
    { id: "clippers", name: "Los Angeles Clippers", route: "/clippers" },
    {
      id: "lakers",
      name: "Los Angeles Lakers",
      route: "/lakers", // Указываем путь для Lakers
    },
    { id: "grizzlies", name: "Memphis Grizzlies", route: "/grizzlies" },
    { id: "heat", name: "Miami Heat", route: "/heat" },
    { id: "bucks", name: "Milwaukee Bucks", route: "/bucks" },
    {
      id: "timberwolves",
      name: "Minnesota Timberwolves",
      route: "/timberwolves",
    },
    { id: "pelicans", name: "New Orleans Pelicans", route: "/pelicans" },
    { id: "knicks", name: "New York Knicks", route: "/knicks" },
    { id: "thunder", name: "Oklahoma City Thunder", route: "/thunder" },
    { id: "magic", name: "Orlando Magic", route: "/magic" },
    { id: "sixers", name: "Philadelphia 76ers", route: "/sevsix" },
    { id: "suns", name: "Phoenix Suns", route: "/suns" },
    { id: "blazers", name: "Portland Trail Blazers", route: "/blazers" },
    { id: "kings", name: "Sacramento Kings", route: "/kings" },
    { id: "spurs", name: "San Antonio Spurs", route: "/spurs" },
    { id: "raptors", name: "Toronto Raptors", route: "/raptors" },
    { id: "jazz", name: "Utah Jazz", route: "/jazz" },
    { id: "wizards", name: "Washington Wizards", route: "/wizards" },
  ];
  const consoleCom: ConsoleItem[] = [
    { id: "head", name: "Head Info", route: "/headInfoAgentControlCenter" },
    {
      id: "roster",
      name: "Team Roster",
      route: "/playersRosterAgentControlCenter",
    },
    { id: "dead", name: "Dead Cap", route: "/deadCapRosterAgentControl" },
    { id: "logs", name: "Logs", route: "/logs" },
    { id: "penalties", name: "Penalties", route: "/penalties" },
    { id: "playerOption", name: "Player Option", route: "/playerOptionMain" },
  ];

  const eventsLeague: EventsLeague[] = [
    { id: "mainTournament", name: "Tournament", route: "/mainTournament" },
    { id: "tradesAll", name: "Trades", route: "/tradesAll" },
  ];

  const marketData: MarketItem[] = [
    {
      id: "playerOptionUserMain",
      name: "Опции игроков",
      route: "/playerOptionUserMain",
    },
    { id: "freeagents", name: "Free Agents", route: "/freeagents" },
  ];

  const [activeTab, setActiveTab] = useState<TabType>("teams");
  const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    date: "",
    errors: "",
    offers: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Обработчик изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    // Валидация
    if (!feedbackData.date) {
      setSubmitMessage("Пожалуйста, заполните поле даты");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      console.log("Подготовка данных для отправки:", {
        date: feedbackData.date,
        errors: feedbackData.errors.substring(0, 50) + "...",
        offers: feedbackData.offers.substring(0, 50) + "...",
      });

      // Отправляем данные в Supabase
      const { data, error } = await supabase.from("Questions").insert([
        {
          date: feedbackData.date,
          errors: feedbackData.errors || null,
          offers: feedbackData.offers || null,
          // created_at добавится автоматически
        },
      ]);

      if (error) {
        console.error("Ошибка Supabase:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        // Проверяем типичные ошибки
        if (error.code === "42501") {
          throw new Error(
            "Ошибка прав доступа. Проверьте RLS политики в Supabase.",
          );
        } else if (error.code === "42P01") {
          throw new Error(
            'Таблица "Questions" не найдена. Создайте ее в Supabase.',
          );
        } else if (error.message.includes("JWT")) {
          throw new Error(
            "Неверный API ключ. Проверьте REACT_APP_SUPABASE_ANON_KEY.",
          );
        } else {
          throw error;
        }
      }

      console.log("✅ Данные успешно отправлены:", data);
      setSubmitMessage("✅ Спасибо! Ваш отзыв сохранен.");

      // Сброс формы и закрытие меню через 2 секунды
      setTimeout(() => {
        setFeedbackData({ date: "", errors: "", offers: "" });
        setShowFeedbackMenu(false);
        setSubmitMessage("");
      }, 2000);
    } catch (error: any) {
      console.error("Полная ошибка:", error);

      let errorMessage = "Произошла ошибка при сохранении";

      if (error.message.includes("RLS")) {
        errorMessage =
          "Ошибка доступа. Проверьте RLS политики в Supabase Dashboard.";
      } else if (error.message.includes("Таблица")) {
        errorMessage =
          "Таблица не найдена. Создайте таблицу 'Questions' в Supabase.";
      } else if (error.message.includes("API ключ")) {
        errorMessage =
          "Проблема с API ключом. Проверьте настройки в файле .env";
      }

      setSubmitMessage(`❌ ${errorMessage}`);
      setTimeout(() => setSubmitMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик закрытия меню
  const handleCloseMenu = () => {
    setShowFeedbackMenu(false);
    setFeedbackData({ date: "", errors: "", offers: "" });
    setSubmitMessage("");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "teams":
        return (
          <div className="teams-content">
            {teams.map((team) => {
              if (team.route) {
                return (
                  <Link to={team.route} key={team.id} className="team-link">
                    <div className="team-card">
                      <h3>{team.name}</h3>
                    </div>
                  </Link>
                );
              }
              return (
                <div className="team-card" key={team.id}>
                  <h3>{team.name}</h3>
                </div>
              );
            })}
          </div>
        );
      case "console":
        return (
          <div className="console-content">
            {consoleCom.map((ConsoleItem) => {
              if (ConsoleItem.route) {
                return (
                  <Link
                    to={ConsoleItem.route}
                    key={ConsoleItem.id}
                    className="console-link"
                  >
                    <div className="console-card">
                      <h3>{ConsoleItem.name}</h3>
                    </div>
                  </Link>
                );
              }
              return (
                <div className="console-card" key={ConsoleItem.id}>
                  <h3>{ConsoleItem.name}</h3>
                </div>
              );
            })}
          </div>
        );
      case "reserve":
        return (
          <div className="reserve-content">
            {eventsLeague.map((event) => {
              if (event.route) {
                return (
                  <Link
                    to={event.route}
                    key={event.id}
                    className="reserve-link"
                  >
                    <div className="reserve-card">
                      <h3>{event.name}</h3>
                    </div>
                  </Link>
                );
              }
              return (
                <div className="reserve-card" key={event.id}>
                  <h3>{event.name}</h3>
                </div>
              );
            })}
          </div>
        );
      case "market":
        return (
          <div className="market-content">
            {marketData.map((marketItem) => {
              if (marketItem.route) {
                return (
                  <Link
                    to={marketItem.route}
                    key={marketItem.id}
                    className="market-link"
                  >
                    <div className="market-card">
                      <h3>{marketItem.name}</h3>
                    </div>
                  </Link>
                );
              }
              return (
                <div className="market-card" key={marketItem.id}>
                  <h3>{marketItem.name}</h3>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main">
      {/* Контекстное меню обратной связи */}
      {showFeedbackMenu && (
        <div className="feedback-overlay" onClick={handleCloseMenu}>
          <div className="feedback-menu" onClick={(e) => e.stopPropagation()}>
            <h3>Обратная связь</h3>

            <div className="feedback-form">
              <div className="form-group">
                <label htmlFor="date">Дата:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={feedbackData.date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="errors">Ошибки:</label>
                <textarea
                  id="errors"
                  name="errors"
                  value={feedbackData.errors}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Опишите найденные ошибки..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="offers">Предложения:</label>
                <textarea
                  id="offers"
                  name="offers"
                  value={feedbackData.offers}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Ваши предложения по улучшению..."
                  rows={4}
                />
              </div>

              {submitMessage && (
                <div
                  className={`submit-message ${
                    submitMessage.includes("ошибка") ? "error" : "success"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <div className="feedback-buttons">
                <button
                  onClick={handleSubmitFeedback}
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить"}
                </button>
                <button
                  onClick={handleCloseMenu}
                  className="close-btn"
                  disabled={isSubmitting}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="headerMain">
        <img className="logo" src={logo} alt="League Logo" />
        <h1>
          NBA <span>Fantasy</span> League <span>Flshng</span> Lights
        </h1>
        <div className="quest-wrapper">
          <img
            className="quest"
            src={quest}
            alt="Quest Icon"
            onClick={() => setShowFeedbackMenu(true)}
            style={{ cursor: "pointer" }}
          />
          <span className="quest-tooltip">Обратная связь</span>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            Команды
          </button>
          <button
            className={`tab ${activeTab === "console" ? "active" : ""}`}
            onClick={() => setActiveTab("console")}
          >
            Консоль комиссионера
          </button>
          <button
            className={`tab ${activeTab === "reserve" ? "active" : ""}`}
            onClick={() => setActiveTab("reserve")}
          >
            События
          </button>
          <button
            className={`tab ${activeTab === "market" ? "active" : ""}`}
            onClick={() => setActiveTab("market")}
          >
            Рынок
          </button>
        </div>
      </div>

      <div className="body">{renderContent()}</div>
    </div>
  );
};

export default Main;
