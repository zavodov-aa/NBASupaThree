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

const SunsMain = () => {
  return (
    <>
      <TeamProvider teamId="suns">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Phoenix Suns"} />
      <TeamBodeGeneralInfo teamName={"Phoenix Suns"} />
      <TeamRoster team={"Phoenix Suns"} />
      <TeamBodyGeneralTradeList teamId={"Phoenix Suns"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Phoenix Suns"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Phoenix Suns"} />
      </div>
    </>
  );
};

export default SunsMain;
