import React from "react";
import LogsHeader from "./archive/LogsHeader";
import Logs from "./logs";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";

const LogsMain = () => {
  return (
    <div>
      {/* <LogsHeader /> */}
      <PlayerOptionHeader />
      <Logs />
    </div>
  );
};

export default LogsMain;
