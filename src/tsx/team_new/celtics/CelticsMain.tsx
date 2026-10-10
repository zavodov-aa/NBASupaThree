import React from "react";
import HeaderAll from "../HEADER/HeaderAll";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";
import TeamBodyGeneralRosterMain from "../TEAMBODYGENERALROSTER/TeamBodyGeneralRosterMain";
import TeamBodyGeneralTradeList from "../TEAMBODYGENERALTRADELIST/TeamBodyGeneralTradeList";
import TeamBodyGeneralPicks from "../TEAMBODYGENERALPICKS/TeamBodyGeneralPicks";
import TeamBodyGeneralViewCash from "../TeamBodyGeneralViewCash/TeamBodyGeneralViewCash";
import "../TEAMBODYGENERALPICKS/teamBodyGeneralPicksOnTeams.css";
import "../TeamBodyGeneralViewCash/teamBodyGeneralCashOnTeams.css";
import TradesTwoWay from "../../events/trades_New/Trades_Two_way";

const CelticsMain = () => {
  return (
    <>
      <TeamProvider teamId="celtics">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Boston Celtics"} />
      <TeamBodeGeneralInfo teamName={"Boston Celtics"} />
      <TeamBodyGeneralRosterMain team={"Boston Celtics"} />
      <TeamBodyGeneralTradeList teamId={"Boston Celtics"} />
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Boston Celtics"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Boston Celtics"} />
      </div>
      {/* <TradesTwoWay currentTeam="Boston Celtics" /> */}
    </>
  );
};

export default CelticsMain;
