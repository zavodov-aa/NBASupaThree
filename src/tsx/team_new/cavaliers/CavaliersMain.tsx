import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const CavaliersMain = () => {
  return (
    <>
      <TeamProvider teamId="cavaliers">
        <HeaderAll />
      </TeamProvider>
      "
    </>
  );
};

export default CavaliersMain;
