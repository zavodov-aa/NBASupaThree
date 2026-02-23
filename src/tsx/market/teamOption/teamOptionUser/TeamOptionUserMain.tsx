import React from "react";
import PlayerOptionHeader from "../../playerOption/playerOptionAdmin/PlayerOptionHeader";
import TeamOptionUser from "./TeamOptionUser";
import PlayerOptionHeaderUser from "../../playerOption/playerOptionUser/PlayerOptionHeaderUser";

const TeamOptionUserMain = () => {
  return (
    <>
      <PlayerOptionHeaderUser />
      <TeamOptionUser />
    </>
  );
};

export default TeamOptionUserMain;
