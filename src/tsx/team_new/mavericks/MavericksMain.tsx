import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const MavericksMain = () => {
  return (
    <>
      <TeamProvider teamId="mavericks">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default MavericksMain;
