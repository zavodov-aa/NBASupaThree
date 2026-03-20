import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const ThunderMain = () => {
  return (
    <>
      <TeamProvider teamId="thunder">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default ThunderMain;
