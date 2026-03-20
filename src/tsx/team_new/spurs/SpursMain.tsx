import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const SpursMan = () => {
  return (
    <>
      <TeamProvider teamId="spurs">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default SpursMan;
