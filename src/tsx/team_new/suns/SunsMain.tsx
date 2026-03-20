import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const SunsMain = () => {
  return (
    <>
      <TeamProvider teamId="suns">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default SunsMain;
