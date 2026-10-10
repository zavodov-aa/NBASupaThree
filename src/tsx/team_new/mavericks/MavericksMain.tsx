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

const MavericksMain = () => {
  return (
    <>
      <TeamProvider teamId="mavericks">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Dallas Mavericks"} />
      <TeamBodeGeneralInfo teamName={"Dallas Mavericks"} />
      <TeamRoster team={"Dallas Mavericks"} />
      <TeamBodyGeneralTradeList teamId={"Dallas Mavericks"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Dallas Mavericks"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Dallas Mavericks"} />
      </div>
    </>
  );
};

export default MavericksMain;
