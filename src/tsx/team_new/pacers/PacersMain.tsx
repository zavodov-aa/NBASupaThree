import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const PacersMain = () => {
  return (
    <>
      <TeamProvider teamId="pacers">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default PacersMain;
