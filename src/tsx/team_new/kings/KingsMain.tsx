import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const KingsMain = () => {
  return (
    <>
      <TeamProvider teamId="kings">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default KingsMain;
