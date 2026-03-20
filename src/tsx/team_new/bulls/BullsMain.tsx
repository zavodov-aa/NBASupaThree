import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const BullsMain = () => {
  return (
    <>
      <TeamProvider teamId="bulls">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default BullsMain;
