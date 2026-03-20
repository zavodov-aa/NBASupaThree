import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const GrizzliesMain = () => {
  return (
    <>
      <TeamProvider teamId="grizzlies">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default GrizzliesMain;
