import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";
import TeamRoster from "../TEAMBODYGENERALROSTER/TeamBodyGeneralRosterMain";
import TeamBodyGeneralTradeList from "../TEAMBODYGENERALTRADELIST/TeamBodyGeneralTradeList";
import TeamBodyGeneralPicks from "../TEAMBODYGENERALPICKS/TeamBodyGeneralPicks";
import TeamBodyGeneralViewCash from "../TeamBodyGeneralViewCash/TeamBodyGeneralViewCash";
import "../TEAMBODYGENERALPICKS/teamBodyGeneralPicksOnTeams.css";
import "../TeamBodyGeneralViewCash/teamBodyGeneralCashOnTeams.css";

const CavaliersMain = () => {
  return (
    <>
      <TeamProvider teamId="cavaliers">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Cleveland Cavaliers"} />
      <TeamBodeGeneralInfo teamName={"Cleveland Cavaliers"} />
      <TeamRoster team={"Cleveland Cavaliers"} />
      <TeamBodyGeneralTradeList teamId={"Cleveland Cavaliers"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Cleveland Cavaliers"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Cleveland Cavaliers"} />
      </div>
    </>
  );
};

export default CavaliersMain;
