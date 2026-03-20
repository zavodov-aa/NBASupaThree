import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const JazzMain = () => {
  return (
    <>
      <TeamProvider teamId="jazz">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default JazzMain;
