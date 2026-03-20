import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const KnicksMain = () => {
  return (
    <>
      <TeamProvider teamId="knicks">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default KnicksMain;
