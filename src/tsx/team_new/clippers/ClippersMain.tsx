import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const ClippersMain = () => {
  return (
    <>
      <TeamProvider teamId="clippers">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default ClippersMain;
