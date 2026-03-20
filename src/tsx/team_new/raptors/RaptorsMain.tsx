import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const RaptorsMain = () => {
  return (
    <>
      <TeamProvider teamId="raptors">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default RaptorsMain;
