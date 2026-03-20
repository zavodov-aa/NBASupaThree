import React from "react";
import HeaderAll from "../HEADER/HeaderAll";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";

const NetsMain = () => {
  return (
    <>
      <TeamProvider teamId="nets">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Brooklyn Nets"} />
      <TeamBodeGeneralInfo teamName={"Nets"} />
    </>
  );
};

export default NetsMain;
