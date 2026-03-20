import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const LakersMain = () => {
  return (
    <>
      <TeamProvider teamId="lakers">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default LakersMain;
