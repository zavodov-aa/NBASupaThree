import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const MagicMain = () => {
  return (
    <>
      <TeamProvider teamId="magic">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default MagicMain;
