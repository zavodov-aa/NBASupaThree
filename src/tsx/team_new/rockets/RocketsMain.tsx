import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const RocketsMain = () => {
  return (
    <>
      <TeamProvider teamId="rockets">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default RocketsMain;
