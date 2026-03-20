import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const WarriorsMain = () => {
  return (
    <>
      <TeamProvider teamId="warriors">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default WarriorsMain;
