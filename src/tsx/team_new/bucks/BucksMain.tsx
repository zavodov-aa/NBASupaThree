import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const BucksMain = () => {
  return (
    <>
      <TeamProvider teamId="bucks">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default BucksMain;
