import React from "react";
import HeaderAll from "../HEADER/HeaderAll";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";

const CelticsMain = () => {
  return (
    <>
      <TeamProvider teamId="celtics">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Boston Celtics"} />
      <TeamBodeGeneralInfo teamName={"Celtics"} />
    </>
  );
};

export default CelticsMain;
