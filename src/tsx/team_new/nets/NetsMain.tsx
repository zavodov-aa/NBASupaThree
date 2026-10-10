import React from "react";
import HeaderAll from "../HEADER/HeaderAll";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";
import TeamRoster from "../TEAMBODYGENERALROSTER/TeamBodyGeneralRosterMain";
import TeamBodyGeneralTradeList from "../TEAMBODYGENERALTRADELIST/TeamBodyGeneralTradeList";
import TeamBodyGeneralPicks from "../TEAMBODYGENERALPICKS/TeamBodyGeneralPicks";
import TeamBodyGeneralViewCash from "../TeamBodyGeneralViewCash/TeamBodyGeneralViewCash";
import "../TEAMBODYGENERALPICKS/teamBodyGeneralPicksOnTeams.css";
import "../TeamBodyGeneralViewCash/teamBodyGeneralCashOnTeams.css";

const NetsMain = () => {
  return (
    <>
      <TeamProvider teamId="nets">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Brooklyn Nets"} />
      <TeamBodeGeneralInfo teamName={"Brooklyn Nets"} />
      <TeamRoster team="Brooklyn Nets" />
      <TeamBodyGeneralTradeList teamId={"Brooklyn Nets"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Brooklyn Nets"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Brooklyn Nets"} />
      </div>
    </>
  );
};

export default NetsMain;
