import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

const PelicansMain = () => {
  return (
    <>
      <TeamProvider teamId="pelicans">
        <HeaderAll />
      </TeamProvider>
    </>
  );
};

export default PelicansMain;
