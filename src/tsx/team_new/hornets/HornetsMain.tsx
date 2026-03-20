import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const HornetsMain = () => {
  return (
    <>
      <TeamProvider teamId="hornets">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default HornetsMain;
