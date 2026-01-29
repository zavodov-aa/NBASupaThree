import React from "react";
import PlayerOptionUser from "./PlayerOptionUser";
import PlayerOptionHeader from "../playerOptionAdmin/PlayerOptionHeader";
import PlayerOptionHeaderUser from "./PlayerOptionHeaderUser";

const PlayerOptionUserMain = () => {
  return (
    <>
      <PlayerOptionHeaderUser />
      <PlayerOptionUser />
    </>
  );
};

export default PlayerOptionUserMain;
