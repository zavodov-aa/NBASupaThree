import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";
import "../TEAMBODYGENERALPICKS/teamBodyGeneralPicksOnTeams.css";
import "../TeamBodyGeneralViewCash/teamBodyGeneralCashOnTeams.css";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodyGeneralPicks from "../TEAMBODYGENERALPICKS/TeamBodyGeneralPicks";
import TeamRoster from "../TEAMBODYGENERALROSTER/TeamBodyGeneralRosterMain";
import TeamBodyGeneralTradeList from "../TEAMBODYGENERALTRADELIST/TeamBodyGeneralTradeList";
import TeamBodyGeneralViewCash from "../TeamBodyGeneralViewCash/TeamBodyGeneralViewCash";

const HeatMain = () => {
  return (
    <>
      <TeamProvider teamId="heat">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Miami Heat"} />
      <TeamBodeGeneralInfo teamName={"Miami Heat"} />
      <TeamRoster team={"Miami Heat"} />
      <TeamBodyGeneralTradeList teamId={"Miami Heat"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Miami Heat"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Miami Heat"} />
      </div>
    </>
  );
};

export default HeatMain;
