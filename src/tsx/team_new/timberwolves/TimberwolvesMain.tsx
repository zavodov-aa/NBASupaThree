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

const TimberwolvesMain = () => {
  return (
    <>
      <TeamProvider teamId="timberwolves">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Minnesota Timberwolves"} />
      <TeamBodeGeneralInfo teamName={"Minnesota Timberwolves"} />
      <TeamRoster team={"Minnesota Timberwolves"} />
      <TeamBodyGeneralTradeList teamId={"Minnesota Timberwolves"} />

      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Minnesota Timberwolves"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Minnesota Timberwolves"} />
      </div>
    </>
  );
};

export default TimberwolvesMain;
