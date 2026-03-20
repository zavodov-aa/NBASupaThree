// import React from "react";
// import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
// import PlayerConsoleAdminBody from "./PlayerConsoleAdminBody";

// import "../playersRosterAgentControlCenter.css";

// const PlayerConsoleAdminMain = () => {
//   return (
//     <>
//       <PlayerOptionHeader />
//       <PlayerConsoleAdminBody />
//     </>
//   );
// };

// export default PlayerConsoleAdminMain;

import React from "react";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
import PlayerConsoleAdminBody from "./PlayerConsoleAdminBody";
import PicksBody from "../picks/picksBody/PicksBody"; // укажите верный путь

import "../playersRosterAgentControlCenter.css";

const PlayerConsoleAdminMain = () => {
  return (
    <>
      <PlayerOptionHeader />
      <PlayerConsoleAdminBody />
      <div className="fixed-picks-button">
        <PicksBody />
      </div>
    </>
  );
};

export default PlayerConsoleAdminMain;
