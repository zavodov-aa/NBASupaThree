import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const SevsixMain = () => {
  return (
    <>
      <TeamProvider teamId="sixers">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default SevsixMain;
