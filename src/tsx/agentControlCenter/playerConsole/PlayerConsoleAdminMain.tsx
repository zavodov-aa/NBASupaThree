// import React from "react";
// import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
// import PlayerConsoleAdminBody from "./PlayerConsoleAdminBody";
// import PicksBody from "../picks/picksBody/PicksBody"; // укажите верный путь

// import "../playersRosterAgentControlCenter.css";

// import CashBody from "../picks/cashBody/CashBody";

// const PlayerConsoleAdminMain = () => {
//   return (
//     <>
//       <PlayerOptionHeader />
//       <PlayerConsoleAdminBody />
//       <div className="fixed-picks-button">
//         <PicksBody />
//         <CashBody />
//       </div>
//     </>
//   );
// };

// export default PlayerConsoleAdminMain;

import React from "react";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
import PlayerConsoleAdminBody from "./PlayerConsoleAdminBody";
import PicksBody from "../picks/picksBody/PicksBody";
import CashBody from "../picks/cashBody/CashBody";

import { useRole } from "../../authorization/useRole";
import "../playersRosterAgentControlCenter.css";

const PlayerConsoleAdminMain = () => {
  const { isAdmin } = useRole();
  const readOnly = !isAdmin;

  return (
    <>
      <PlayerOptionHeader />
      <PlayerConsoleAdminBody />

      <div className="fixed-picks-button">
        <PicksBody readOnly={readOnly} />
        <CashBody readOnly={readOnly} />
      </div>
    </>
  );
};

export default PlayerConsoleAdminMain;
