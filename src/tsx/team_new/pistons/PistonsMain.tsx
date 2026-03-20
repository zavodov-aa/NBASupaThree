import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const PistonsMain = () => {
  return (
    <>
      <TeamProvider teamId="pistons">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default PistonsMain;
