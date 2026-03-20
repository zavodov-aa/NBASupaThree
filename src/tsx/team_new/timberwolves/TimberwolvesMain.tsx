import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const TimberwolvesMain = () => {
  return (
    <>
      <TeamProvider teamId="timberwolves">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default TimberwolvesMain;
