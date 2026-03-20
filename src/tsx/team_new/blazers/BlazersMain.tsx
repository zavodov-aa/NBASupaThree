import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const BlazersMain = () => {
  return (
    <>
      <TeamProvider teamId="trailblazers">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default BlazersMain;
