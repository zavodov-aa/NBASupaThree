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

const KingsMain = () => {
  return (
    <>
      <TeamProvider teamId="kings">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Sacramento Kings"} />
      <TeamBodeGeneralInfo teamName={"Sacramento Kings"} />
      <TeamRoster team={"Sacramento Kings"} />
      <TeamBodyGeneralTradeList teamId={"Sacramento Kings"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Sacramento Kings"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Sacramento Kings"} />
      </div>
    </>
  );
};

export default KingsMain;
