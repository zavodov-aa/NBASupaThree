import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const WizardsMain = () => {
  return (
    <>
      <TeamProvider teamId="wizards">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default WizardsMain;
