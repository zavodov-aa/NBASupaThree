import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const NuggetsMain = () => {
  return (
    <>
      <TeamProvider teamId="nuggets">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default NuggetsMain;
