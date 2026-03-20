// HawksMain.tsx
import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";

import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";

const HawksMain = () => {
  return (
    <>
      <TeamProvider teamId="hawks">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Atlanta Hawks"} />
      <TeamBodeGeneralInfo teamName={"Hawks"} />
    </>
  );
};

export default HawksMain;
