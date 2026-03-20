import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const HeatMain = () => {
  return (
    <>
      <TeamProvider teamId="heat">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default HeatMain;
