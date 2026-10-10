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

const HornetsMain = () => {
  return (
    <>
      <TeamProvider teamId="hornets">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Charlotte Hornets"} />
      <TeamBodeGeneralInfo teamName={"Charlotte Hornets"} />
      <TeamRoster team={"Charlotte Hornets"} />
      <TeamBodyGeneralTradeList teamId={"Charlotte Hornets"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Charlotte Hornets"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Charlotte Hornets"} />
      </div>
    </>
  );
};

export default HornetsMain;
