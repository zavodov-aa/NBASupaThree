// // HawksMain.tsx
// import React from "react";
// import { TeamProvider } from "../HEADER/HeaderTeamContext";
// import HeaderAll from "../HEADER/HeaderAll";

// import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
// import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";
// import TeamRoster from "../TEAMBODYGENERALROSTER/TeamBodyGeneralRosterMain";
// import TeamBodyGeneralTradeList from "../TEAMBODYGENERALTRADELIST/TeamBodyGeneralTradeList";
// import TeamBodyGeneralPicks from "../TEAMBODYGENERALPICKS/TeamBodyGeneralPicks";

// const HawksMain = () => {
//   return (
//     <>
//       <TeamProvider teamId="hawks">
//         <HeaderAll />
//       </TeamProvider>
//       <TeamBodyGeneralLogoName teamName={"Atlanta Hawks"} />
//       <TeamBodeGeneralInfo teamName={"Atlanta Hawks"} />
//       <TeamRoster team={"Atlanta Hawks"} />
//       <TeamBodyGeneralTradeList teamId={"Atlanta Hawks"} />
//       <TeamBodyGeneralPicks teamName={"Atlanta Hawks"} />
//     </>
//   );
// };

// export default HawksMain;

// HawksMain.tsx
import React from "react";
import { TeamProvider } from "../HEADER/HeaderTeamContext";
import HeaderAll from "../HEADER/HeaderAll";
import TeamBodyGeneralLogoName from "../TEAMBODYGENERALLOGONAME/TeamBodyGeneralLogoName";
import TeamBodeGeneralInfo from "../TEAMBODYGENERALINFO/TeamBodeGeneralInfo";
import TeamRoster from "../TEAMBODYGENERALROSTER/TeamBodyGeneralRosterMain";
import TeamBodyGeneralTradeList from "../TEAMBODYGENERALTRADELIST/TeamBodyGeneralTradeList";
import TeamBodyGeneralPicks from "../TEAMBODYGENERALPICKS/TeamBodyGeneralPicks";
// import "./hawksMain.css";
import "../TEAMBODYGENERALPICKS/teamBodyGeneralPicksOnTeams.css";
import "../TeamBodyGeneralViewCash/teamBodyGeneralCashOnTeams.css";
import TeamBodyGeneralViewCash from "../TeamBodyGeneralViewCash/TeamBodyGeneralViewCash";
import TradesTwoWay from "../../events/trades_New/Trades_Two_way";
import Trades from "../../events/trades/Trades";
import Trades_Two_way from "../../events/trades_New/Trades_Two_way";

const HawksMain = () => {
  return (
    <>
      <TeamProvider teamId="hawks">
        <HeaderAll />
      </TeamProvider>
      <TeamBodyGeneralLogoName teamName={"Atlanta Hawks"} />
      <TeamBodeGeneralInfo teamName={"Atlanta Hawks"} />
      <TeamRoster team={"Atlanta Hawks"} />
      <TeamBodyGeneralTradeList teamId={"Atlanta Hawks"} />
      {/* Обёртка для sticky-поведения */}
      <div className="picks-general-on-teams-sticky-container">
        <TeamBodyGeneralPicks teamName={"Atlanta Hawks"} />
      </div>
      <div className="cash-general-on-teams-sticky-container">
        <TeamBodyGeneralViewCash teamName={"Atlanta Hawks"} />
      </div>
      {
        /*старая форма трейдов 1 ВАРИАНТ*/
        // {
        /* <TradesTwoWay currentTeam="Atlanta Hawks" /> */
        // }
        /*старая форма трейдов 1 ВАРИАНТ*/
      }
      {
        /*форма пользовательских трейдов 2 ВАРИАНТ */
        //  <Trades_Two_way currentTeam="Atlanta Hawks" />
        // <Trades />
        /*форма пользовательских трейдов 2 ВАРИАНТ */
      }
    </>
  );
};

export default HawksMain;
