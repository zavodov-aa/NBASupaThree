// import React, { useState } from "react";
// import Trades_Two_way_currentTeam from "./Trades_Two_way_currentTeam";
// import Trades_Two_way_players from "./Trades_Two_way_players";
// import Trades_Two_way_gleague from "./Trades_Two_way_gleague";
// import Trades_Two_way_picks from "./Trades_Two_way_picks";
// import Trades_Two_way_deadcapVOne from "./Trades_Two_way_deadcapVOne";
// import TradeSummary, { DeadCapPlayer } from "./Trades_Two_way_TradeSummary";
// import Trades_Two_way_cash from "./Trades_Two_way_cash";
// import "./trades_Two_way.css";

// interface Trades_Two_wayProps {
//   currentTeam?: string;
// }

// type Step =
//   | "team"
//   | "players"
//   | "gleague"
//   | "picks"
//   | "deadcap"
//   | "cash"
//   | "summary";

// interface Player {
//   id: number;
//   active_roster: string;
//   position?: string;
//   team?: string;
//   g_league?: string;
// }

// interface PickItem {
//   id: string;
//   label: string;
//   team: string;
// }

// // Вспомогательная функция для извлечения числа из зарплаты (оставлена на случай, если нужна где-то ещё)
// const extractSalaryNumber = (value: unknown): number => {
//   if (typeof value === "number") return isNaN(value) ? 0 : value;
//   if (typeof value === "string") {
//     const withoutSpaces = value.replace(/\s/g, "");
//     const match = withoutSpaces.match(/(\d+(?:\.\d+)?)/);
//     if (match) return parseFloat(match[1]);
//   }
//   return 0;
// };

// const Trades_Two_way: React.FC<Trades_Two_wayProps> = ({
//   currentTeam = "",
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [step, setStep] = useState<Step>("team");
//   const [selectedTeamForTrade, setSelectedTeamForTrade] = useState<string>("");

//   const [selectedMainMy, setSelectedMainMy] = useState<Player[]>([]);
//   const [selectedMainTheir, setSelectedMainTheir] = useState<Player[]>([]);
//   const [selectedGleagueMy, setSelectedGleagueMy] = useState<Player[]>([]);
//   const [selectedGleagueTheir, setSelectedGleagueTheir] = useState<Player[]>(
//     [],
//   );

//   const [selectedPicksMy, setSelectedPicksMy] = useState<PickItem[]>([]);
//   const [selectedPicksTheir, setSelectedPicksTheir] = useState<PickItem[]>([]);

//   const [deadCapPlayersMy, setDeadCapPlayersMy] = useState<DeadCapPlayer[]>([]);
//   const [deadCapPlayersTheir, setDeadCapPlayersTheir] = useState<
//     DeadCapPlayer[]
//   >([]);

//   const [cash, setCash] = useState<{
//     amount: number;
//     direction: "myToTheir" | "theirToMy";
//   }>({
//     amount: 0,
//     direction: "myToTheir",
//   });

//   const [generalNote, setGeneralNote] = useState("");
//   const [myTeamNote, setMyTeamNote] = useState("");
//   const [theirTeamNote, setTheirTeamNote] = useState("");

//   const openModal = () => {
//     setIsModalOpen(true);
//     resetTrade();
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const resetTrade = () => {
//     setStep("team");
//     setSelectedTeamForTrade("");
//     setSelectedMainMy([]);
//     setSelectedMainTheir([]);
//     setSelectedGleagueMy([]);
//     setSelectedGleagueTheir([]);
//     setSelectedPicksMy([]);
//     setSelectedPicksTheir([]);
//     setDeadCapPlayersMy([]);
//     setDeadCapPlayersTheir([]);
//     setCash({ amount: 0, direction: "myToTheir" }); // добавлено
//     setGeneralNote("");
//     setMyTeamNote("");
//     setTheirTeamNote("");
//   };
//   const handleTeamSelect = (team: string) => {
//     setSelectedTeamForTrade(team);
//   };

//   const handleNext = () => {
//     if (selectedTeamForTrade) {
//       setStep("players");
//     }
//   };

//   const handlePlayersNext = (mySelected: Player[], theirSelected: Player[]) => {
//     setSelectedMainMy(mySelected);
//     setSelectedMainTheir(theirSelected);
//     setStep("gleague");
//   };

//   const handleGleagueNext = (mySelected: Player[], theirSelected: Player[]) => {
//     setSelectedGleagueMy(mySelected);
//     setSelectedGleagueTheir(theirSelected);
//     setStep("picks");
//   };

//   const handlePicksNext = (
//     mySelectedPicks: PickItem[],
//     theirSelectedPicks: PickItem[],
//   ) => {
//     setSelectedPicksMy(mySelectedPicks);
//     setSelectedPicksTheir(theirSelectedPicks);
//     setStep("deadcap");
//   };

//   const handleDeadCapSubmit = (mySelected: any[], theirSelected: any[]) => {
//     const toDeadCapPlayer = (player: any): DeadCapPlayer => ({
//       id: player.id,
//       name: player.active_roster || `Игрок ${player.id}`,
//       originalSalariesRawByYear: player.originalSalariesRawByYear || {},
//       retentionByYear: player.retentionByYear || {},
//       finalSalariesByYear: player.finalSalariesByYear || {},
//     });

//     setDeadCapPlayersMy(mySelected.map(toDeadCapPlayer));
//     setDeadCapPlayersTheir(theirSelected.map(toDeadCapPlayer));
//     setStep("cash"); // было "summary"
//   };

//   const handleCashSubmit = (cashData: {
//     amount: number;
//     direction: "myToTheir" | "theirToMy";
//   }) => {
//     setCash(cashData);
//     setStep("summary");
//   };

//   const handleFinalSubmit = () => {
//     const allMyPlayers = [...selectedMainMy, ...selectedGleagueMy];
//     const allTheirPlayers = [...selectedMainTheir, ...selectedGleagueTheir];

//     console.log("Итоговый трейд:", {
//       myTeam: currentTeam,
//       theirTeam: selectedTeamForTrade,
//       myPlayers: allMyPlayers,
//       theirPlayers: allTheirPlayers,
//       myPicks: selectedPicksMy,
//       theirPicks: selectedPicksTheir,
//       deadCapPlayersMy,
//       deadCapPlayersTheir,
//       generalNote,
//       myTeamNote,
//       theirTeamNote,
//     });
//     alert(`Трейд предложен!
// Общее примечание: ${generalNote || "—"}
// Примечание для ${currentTeam}: ${myTeamNote || "—"}
// Примечание для ${selectedTeamForTrade}: ${theirTeamNote || "—"}`);
//     closeModal();
//   };

//   return (
//     <>
//       <button className="Trades-Two-way-button" onClick={openModal}>
//         Trade_Two_way
//       </button>

//       {isModalOpen && (
//         <div className="Trades-Two-way-overlay" onClick={closeModal}>
//           <div
//             className="Trades-Two-way-container"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="Trades-Two-way-header">
//               <h3 className="Trades-Two-way-title">Двусторонний трейд</h3>
//               <button className="Trades-Two-way-close" onClick={closeModal}>
//                 ✕
//               </button>
//             </div>

//             <div className="Trades-Two-way-content">
//               {step === "team" && (
//                 <>
//                   <Trades_Two_way_currentTeam
//                     currentTeam={currentTeam}
//                     onTeamSelect={handleTeamSelect}
//                   />
//                   <div className="Trades-Two-way-actions">
//                     <button
//                       className="Trades-Two-way-next"
//                       onClick={handleNext}
//                       disabled={!selectedTeamForTrade}
//                     >
//                       Далее
//                     </button>
//                   </div>
//                 </>
//               )}

//               {step === "players" && (
//                 <Trades_Two_way_players
//                   myTeam={currentTeam}
//                   theirTeam={selectedTeamForTrade}
//                   onBack={() => setStep("team")}
//                   onNext={handlePlayersNext}
//                 />
//               )}

//               {step === "gleague" && (
//                 <Trades_Two_way_gleague
//                   myTeam={currentTeam}
//                   theirTeam={selectedTeamForTrade}
//                   onBack={() => setStep("players")}
//                   onSubmit={handleGleagueNext}
//                 />
//               )}

//               {step === "picks" && (
//                 <Trades_Two_way_picks
//                   myTeam={currentTeam}
//                   theirTeam={selectedTeamForTrade}
//                   onBack={() => setStep("gleague")}
//                   onSubmit={handlePicksNext}
//                 />
//               )}

//               {step === "deadcap" && (
//                 <Trades_Two_way_deadcapVOne
//                   myTeam={currentTeam}
//                   theirTeam={selectedTeamForTrade}
//                   onBack={() => setStep("picks")}
//                   onSubmit={handleDeadCapSubmit}
//                 />
//               )}

//               {step === "cash" && (
//                 <Trades_Two_way_cash
//                   myTeam={currentTeam}
//                   theirTeam={selectedTeamForTrade}
//                   onBack={() => setStep("deadcap")}
//                   onSubmit={handleCashSubmit}
//                   initialCash={cash}
//                 />
//               )}

//               {step === "summary" && (
//                 <TradeSummary
//                   myTeam={currentTeam}
//                   theirTeam={selectedTeamForTrade}
//                   selectedMainMy={selectedMainMy}
//                   selectedMainTheir={selectedMainTheir}
//                   selectedGleagueMy={selectedGleagueMy}
//                   selectedGleagueTheir={selectedGleagueTheir}
//                   selectedPicksMy={selectedPicksMy}
//                   selectedPicksTheir={selectedPicksTheir}
//                   generalNote={generalNote}
//                   myTeamNote={myTeamNote}
//                   theirTeamNote={theirTeamNote}
//                   deadCapPlayersMy={deadCapPlayersMy}
//                   deadCapPlayersTheir={deadCapPlayersTheir}
//                   cash={cash} // новый проп
//                   onBack={() => setStep("cash")} // новый проп для возврата
//                   onGeneralNoteChange={setGeneralNote}
//                   onMyTeamNoteChange={setMyTeamNote}
//                   onTheirTeamNoteChange={setTheirTeamNote}
//                   onSubmit={handleFinalSubmit}
//                   onReset={resetTrade}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Trades_Two_way;

import React, { useState } from "react";
import Trades_Two_way_currentTeam from "./Trades_Two_way_currentTeam";
import Trades_Two_way_players from "./Trades_Two_way_players";
import Trades_Two_way_gleague from "./Trades_Two_way_gleague";
import Trades_Two_way_picks from "./Trades_Two_way_picks";
import Trades_Two_way_deadcapVOne from "./Trades_Two_way_deadcapVOne";
import TradeSummary, { DeadCapPlayer } from "./Trades_Two_way_TradeSummary";
import Trades_Two_way_cash from "./Trades_Two_way_cash";
import "./trades_Two_way.css";

// Импортируем клиент Supabase
import { supabase } from "../../../Supabase"; // путь к вашему файлу с клиентом

interface Trades_Two_wayProps {
  currentTeam?: string;
}

type Step =
  | "team"
  | "players"
  | "gleague"
  | "picks"
  | "deadcap"
  | "cash"
  | "summary";

interface Player {
  id: number;
  active_roster: string;
  position?: string;
  team?: string;
  g_league?: string;
}

interface PickItem {
  id: string;
  label: string;
  team: string;
}

// Вспомогательная функция для извлечения числа из зарплаты (оставлена на случай, если нужна где-то ещё)
const extractSalaryNumber = (value: unknown): number => {
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (typeof value === "string") {
    const withoutSpaces = value.replace(/\s/g, "");
    const match = withoutSpaces.match(/(\d+(?:\.\d+)?)/);
    if (match) return parseFloat(match[1]);
  }
  return 0;
};

const Trades_Two_way: React.FC<Trades_Two_wayProps> = ({
  currentTeam = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<Step>("team");
  const [selectedTeamForTrade, setSelectedTeamForTrade] = useState<string>("");

  const [selectedMainMy, setSelectedMainMy] = useState<Player[]>([]);
  const [selectedMainTheir, setSelectedMainTheir] = useState<Player[]>([]);
  const [selectedGleagueMy, setSelectedGleagueMy] = useState<Player[]>([]);
  const [selectedGleagueTheir, setSelectedGleagueTheir] = useState<Player[]>(
    [],
  );

  const [selectedPicksMy, setSelectedPicksMy] = useState<PickItem[]>([]);
  const [selectedPicksTheir, setSelectedPicksTheir] = useState<PickItem[]>([]);

  const [deadCapPlayersMy, setDeadCapPlayersMy] = useState<DeadCapPlayer[]>([]);
  const [deadCapPlayersTheir, setDeadCapPlayersTheir] = useState<
    DeadCapPlayer[]
  >([]);

  const [cash, setCash] = useState<{
    amount: number;
    direction: "myToTheir" | "theirToMy";
  }>({
    amount: 0,
    direction: "myToTheir",
  });

  const [generalNote, setGeneralNote] = useState("");
  const [myTeamNote, setMyTeamNote] = useState("");
  const [theirTeamNote, setTheirTeamNote] = useState("");

  // Состояние для индикатора загрузки при отправке
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    resetTrade();
  };

  const closeModal = () => setIsModalOpen(false);

  const resetTrade = () => {
    setStep("team");
    setSelectedTeamForTrade("");
    setSelectedMainMy([]);
    setSelectedMainTheir([]);
    setSelectedGleagueMy([]);
    setSelectedGleagueTheir([]);
    setSelectedPicksMy([]);
    setSelectedPicksTheir([]);
    setDeadCapPlayersMy([]);
    setDeadCapPlayersTheir([]);
    setCash({ amount: 0, direction: "myToTheir" });
    setGeneralNote("");
    setMyTeamNote("");
    setTheirTeamNote("");
    setIsSubmitting(false);
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeamForTrade(team);
  };

  const handleNext = () => {
    if (selectedTeamForTrade) {
      setStep("players");
    }
  };

  const handlePlayersNext = (mySelected: Player[], theirSelected: Player[]) => {
    setSelectedMainMy(mySelected);
    setSelectedMainTheir(theirSelected);
    setStep("gleague");
  };

  const handleGleagueNext = (mySelected: Player[], theirSelected: Player[]) => {
    setSelectedGleagueMy(mySelected);
    setSelectedGleagueTheir(theirSelected);
    setStep("picks");
  };

  const handlePicksNext = (
    mySelectedPicks: PickItem[],
    theirSelectedPicks: PickItem[],
  ) => {
    setSelectedPicksMy(mySelectedPicks);
    setSelectedPicksTheir(theirSelectedPicks);
    setStep("deadcap");
  };

  const handleDeadCapSubmit = (mySelected: any[], theirSelected: any[]) => {
    const toDeadCapPlayer = (player: any): DeadCapPlayer => ({
      id: player.id,
      name: player.active_roster || `Игрок ${player.id}`,
      originalSalariesRawByYear: player.originalSalariesRawByYear || {},
      retentionByYear: player.retentionByYear || {},
      finalSalariesByYear: player.finalSalariesByYear || {},
    });

    setDeadCapPlayersMy(mySelected.map(toDeadCapPlayer));
    setDeadCapPlayersTheir(theirSelected.map(toDeadCapPlayer));
    setStep("cash");
  };

  const handleCashSubmit = (cashData: {
    amount: number;
    direction: "myToTheir" | "theirToMy";
  }) => {
    setCash(cashData);
    setStep("summary");
  };

  // Изменённая функция отправки трейда в Supabase
  const handleFinalSubmit = async () => {
    const allMyPlayers = [...selectedMainMy, ...selectedGleagueMy];
    const allTheirPlayers = [...selectedMainTheir, ...selectedGleagueTheir];

    const tradeData = {
      myTeam: currentTeam,
      theirTeam: selectedTeamForTrade,
      myPlayers: allMyPlayers,
      theirPlayers: allTheirPlayers,
      myPicks: selectedPicksMy,
      theirPicks: selectedPicksTheir,
      deadCapPlayersMy,
      deadCapPlayersTheir,
      cash,
      generalNote,
      myTeamNote,
      theirTeamNote,
      createdAt: new Date().toISOString(),
    };

    console.log("Отправка трейда в Supabase:", tradeData);

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("Trades")
        .insert([{ data: tradeData }]);

      if (error) {
        console.error("Ошибка Supabase:", error);
        alert(`Ошибка при сохранении трейда: ${error.message}`);
      } else {
        console.log("Трейд успешно сохранён:", data);
        alert(`Трейд успешно отправлен!
Общее примечание: ${generalNote || "—"}
Примечание для ${currentTeam}: ${myTeamNote || "—"}
Примечание для ${selectedTeamForTrade}: ${theirTeamNote || "—"}`);
        closeModal();
      }
    } catch (err) {
      console.error("Неожиданная ошибка:", err);
      alert("Произошла ошибка при отправке трейда. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className="Trades-Two-way-button" onClick={openModal}>
        Trade_Two_way
      </button>

      {isModalOpen && (
        <div className="Trades-Two-way-overlay" onClick={closeModal}>
          <div
            className="Trades-Two-way-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Trades-Two-way-header">
              <h3 className="Trades-Two-way-title">Двусторонний трейд</h3>
              <button className="Trades-Two-way-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="Trades-Two-way-content">
              {step === "team" && (
                <>
                  <Trades_Two_way_currentTeam
                    currentTeam={currentTeam}
                    onTeamSelect={handleTeamSelect}
                  />
                  <div className="Trades-Two-way-actions">
                    <button
                      className="Trades-Two-way-next"
                      onClick={handleNext}
                      disabled={!selectedTeamForTrade}
                    >
                      Далее
                    </button>
                  </div>
                </>
              )}

              {step === "players" && (
                <Trades_Two_way_players
                  myTeam={currentTeam}
                  theirTeam={selectedTeamForTrade}
                  onBack={() => setStep("team")}
                  onNext={handlePlayersNext}
                />
              )}

              {step === "gleague" && (
                <Trades_Two_way_gleague
                  myTeam={currentTeam}
                  theirTeam={selectedTeamForTrade}
                  onBack={() => setStep("players")}
                  onSubmit={handleGleagueNext}
                />
              )}

              {step === "picks" && (
                <Trades_Two_way_picks
                  myTeam={currentTeam}
                  theirTeam={selectedTeamForTrade}
                  onBack={() => setStep("gleague")}
                  onSubmit={handlePicksNext}
                />
              )}

              {step === "deadcap" && (
                <Trades_Two_way_deadcapVOne
                  myTeam={currentTeam}
                  theirTeam={selectedTeamForTrade}
                  onBack={() => setStep("picks")}
                  onSubmit={handleDeadCapSubmit}
                />
              )}

              {step === "cash" && (
                <Trades_Two_way_cash
                  myTeam={currentTeam}
                  theirTeam={selectedTeamForTrade}
                  onBack={() => setStep("deadcap")}
                  onSubmit={handleCashSubmit}
                  initialCash={cash}
                />
              )}

              {step === "summary" && (
                <TradeSummary
                  myTeam={currentTeam}
                  theirTeam={selectedTeamForTrade}
                  selectedMainMy={selectedMainMy}
                  selectedMainTheir={selectedMainTheir}
                  selectedGleagueMy={selectedGleagueMy}
                  selectedGleagueTheir={selectedGleagueTheir}
                  selectedPicksMy={selectedPicksMy}
                  selectedPicksTheir={selectedPicksTheir}
                  generalNote={generalNote}
                  myTeamNote={myTeamNote}
                  theirTeamNote={theirTeamNote}
                  deadCapPlayersMy={deadCapPlayersMy}
                  deadCapPlayersTheir={deadCapPlayersTheir}
                  cash={cash}
                  onBack={() => setStep("cash")}
                  onGeneralNoteChange={setGeneralNote}
                  onMyTeamNoteChange={setMyTeamNote}
                  onTheirTeamNoteChange={setTheirTeamNote}
                  onSubmit={handleFinalSubmit}
                  onReset={resetTrade}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Trades_Two_way;
