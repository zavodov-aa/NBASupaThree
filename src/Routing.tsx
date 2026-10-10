// import React, { ComponentType } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

// // pages
// import NotFound from "./tsx/pagesZero/NotFound";
// import Forbidden from "./tsx/pagesZero/Forbidden";

// // main
// import MainN from "./tsx/main/MainGroup/MainN";

// // agent control center
// import LogsMain from "./tsx/agentControlCenter/logs/LogsMain";
// import Penalties from "./tsx/agentControlCenter/penalties/Penalties";
// import PlayerConsoleAdminMain from "./tsx/agentControlCenter/playerConsole/PlayerConsoleAdminMain";
// import PicksMain from "./tsx/agentControlCenter/picks/PicksMain";
// import HeadAdminConsoleMain from "./tsx/agentControlCenter/headConsole/HeadAdminConsoleMain";

// // events
// import MainTournament from "./tsx/events/tournament/MainTournament";
// import TradesAll from "./tsx/events/trades/TreadesAllHeader/TradesAll";
// import DraftLotteryMain from "./tsx/events/draftLottery/DraftLotteryMain";

// // market — admin
// import PlayerOptionMain from "./tsx/market/playerOption/playerOptionAdmin/PlayerOptionMain";
// import TeamOptionAdminMain from "./tsx/market/teamOption/teamOptionAdmin/TeamOptionAdminMain";
// import RFAAdminMain from "./tsx/market/rfa/rfaAdmin/RFAAdminMain";
// import UFAAdminFirstRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminFirstRound/UFAAdminFirstRoundMain";
// import UFAAdminSecondRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminSecondRound/UFAAdminSecondRoundMain";
// import UFAAdminThirdRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminThirdRound/UFAAdminThirdRoundMain";

// // market — user
// import PlayerOptionUserMain from "./tsx/market/playerOption/playerOptionUser/PlayerOptionUserMain";
// import TeamOptionUserMain from "./tsx/market/teamOption/teamOptionUser/TeamOptionUserMain";
// import RFAUserFirstRoundMain from "./tsx/market/rfa/rfaUser/RFAUserFirstRoundFull/RFAUserMain";
// import RFAUserSecondMain from "./tsx/market/rfa/rfaUser/RFAUserSecondRoundFull/RFAUserSecondMain";
// import RFAUserResultMain from "./tsx/market/rfa/rfaUser/rfaUserResult/RFAUserResultMain";
// import UFAUFRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRound/UFAUserFirstRoundFirstStage/UFAUFRFirstStageMain";
// import UFAUFRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRound/UFAUserFirstRoundSecondStage/UFAUFRSecondStageMain";
// import UFAUserFirstRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRoundResult/UFAUserFirstRoundResultMain";
// import UFAUSRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRound/UFAUserSecondRoundFirstStage/UFAUSRFirstStageMain";
// import UFAUSRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRound/UFAUserSecondRoundSecondStage/UFAUSRSecondStageMain";
// import UFAUserSecondRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRoundResult/UFAUserSecondRoundResultMain";
// import UFAUTRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRound/UFAUserThirdRoundFirstStage/UFAUTRFirstStageMain";
// import UFAUTRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRound/UFAUserThirdRoundSecondStage/UFAUTRSecondStageMain";
// import UFAUserThirdRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRoundResult/UFAUserThirdRoundResultMain";

// // teams
// import HawksMain from "./tsx/team_new/hawks/HawksMain";
// import CelticsMain from "./tsx/team_new/celtics/CelticsMain";
// import NetsMain from "./tsx/team_new/nets/NetsMain";
// import HornetsMain from "./tsx/team_new/hornets/HornetsMain";
// import BullsMain from "./tsx/team_new/bulls/BullsMain";
// import CavaliersMain from "./tsx/team_new/cavaliers/CavaliersMain";
// import MavericksMain from "./tsx/team_new/mavericks/MavericksMain";
// import NuggetsMain from "./tsx/team_new/nuggets/NuggetsMain";
// import PistonsMain from "./tsx/team_new/pistons/PistonsMain";
// import WarriorsMain from "./tsx/team_new/warriors/WarriorsMain";
// import RocketsMain from "./tsx/team_new/rockets/RocketsMain";
// import PacersMain from "./tsx/team_new/pacers/PacersMain";
// import ClippersMain from "./tsx/team_new/clippers/ClippersMain";
// import LakersMain from "./tsx/team_new/lakers/LakersMain";
// import GrizzliesMain from "./tsx/team_new/grizzlies/GrizzliesMain";
// import HeatMain from "./tsx/team_new/heat/HeatMain";
// import BucksMain from "./tsx/team_new/bucks/BucksMain";
// import TimberwolvesMain from "./tsx/team_new/timberwolves/TimberwolvesMain";
// import PelicansMain from "./tsx/team_new/pelicans/PelicansMain";
// import KnicksMain from "./tsx/team_new/knicks/KnicksMain";
// import ThunderMain from "./tsx/team_new/thunder/ThunderMain";
// import MagicMain from "./tsx/team_new/magic/MagicMain";
// import SevsixMain from "./tsx/team_new/sevsix/SevsixMain";
// import SunsMain from "./tsx/team_new/suns/SunsMain";
// import BlazersMain from "./tsx/team_new/blazers/BlazersMain";
// import KingsMain from "./tsx/team_new/kings/KingsMain";
// import RaptorsMain from "./tsx/team_new/raptors/RaptorsMain";
// import JazzMain from "./tsx/team_new/jazz/JazzMain";
// import WizardsMain from "./tsx/team_new/wizards/WizardsMain";
// import SpursMain from "./tsx/team_new/spurs/SpursMain";

// // auth

// import { AuthProvider } from "./tsx/authorization/AuthContext";
// import { AuthModalProvider } from "./tsx/authorization/AuthModalContext";
// import ProtectedRoute from "./tsx/authorization/ProtectedRoute";
// import AuthModal from "./tsx/authorization/AuthModal";

// // chat
// import ChatMain from "./tsx/chat/ChatMain";

// /* ------------------------------------------------------------------ */
// /*  Teams                                                             */
// /* ------------------------------------------------------------------ */

// type RouteItem = {
//   path: string;
//   Component: ComponentType;
//   roles?: string[];
// };

// const TEAM_ROUTES: RouteItem[] = [
//   { path: "/hawksMain", Component: HawksMain },
//   { path: "/celticsMain", Component: CelticsMain },
//   { path: "/netsMain", Component: NetsMain },
//   { path: "/hornetsMain", Component: HornetsMain },
//   { path: "/bullsMain", Component: BullsMain },
//   { path: "/cavaliersMain", Component: CavaliersMain },
//   { path: "/mavericksMain", Component: MavericksMain },
//   { path: "/nuggetsMain", Component: NuggetsMain },
//   { path: "/pistonsMain", Component: PistonsMain },
//   { path: "/warriorsMain", Component: WarriorsMain },
//   { path: "/rocketsMain", Component: RocketsMain },
//   { path: "/pacersMain", Component: PacersMain },
//   { path: "/clippersMain", Component: ClippersMain },
//   { path: "/lakersMain", Component: LakersMain },
//   { path: "/grizzliesMain", Component: GrizzliesMain },
//   { path: "/heatMain", Component: HeatMain },
//   { path: "/bucksMain", Component: BucksMain },
//   { path: "/timberwolvesMain", Component: TimberwolvesMain },
//   { path: "/pelicansMain", Component: PelicansMain },
//   { path: "/knicksMain", Component: KnicksMain },
//   { path: "/thunderMain", Component: ThunderMain },
//   { path: "/magicMain", Component: MagicMain },
//   { path: "/sevsixMain", Component: SevsixMain },
//   { path: "/sunsMain", Component: SunsMain },
//   { path: "/blazersMain", Component: BlazersMain },
//   { path: "/kingsMain", Component: KingsMain },
//   { path: "/spursMain", Component: SpursMain },
//   { path: "/raptorsMain", Component: RaptorsMain },
//   { path: "/jazzMain", Component: JazzMain },
//   { path: "/wizardsMain", Component: WizardsMain },
// ];

// /* ------------------------------------------------------------------ */
// /*  Admin routes                                                      */
// /* ------------------------------------------------------------------ */

// const ADMIN_ROUTES: RouteItem[] = [
//   {
//     path: "/headAdminConsoleMain",
//     Component: HeadAdminConsoleMain,
//     roles: ["admin", "user"],
//   },
//   {
//     path: "/playerConsoleAdminMain",
//     Component: PlayerConsoleAdminMain,
//     roles: ["admin", "user"],
//   },

//   { path: "/picksMain", Component: PicksMain, roles: ["admin", "user"] },
//   { path: "/logs", Component: LogsMain },
//   { path: "/penalties", Component: Penalties },
//   { path: "/playerOptionMain", Component: PlayerOptionMain },
//   { path: "/teamOptionMain", Component: TeamOptionAdminMain },
//   { path: "/rfaAdminMain", Component: RFAAdminMain },
//   { path: "/ufaAdminFirstRoundMain", Component: UFAAdminFirstRoundMain },
//   { path: "/ufaAdminSecondRoundMain", Component: UFAAdminSecondRoundMain },
//   { path: "/ufaAdminThirdRoundMain", Component: UFAAdminThirdRoundMain },
// ];

// /* ------------------------------------------------------------------ */
// /*  User market routes                                                */
// /* ------------------------------------------------------------------ */

// const USER_MARKET_ROUTES: RouteItem[] = [
//   { path: "/playerOptionUserMain", Component: PlayerOptionUserMain },
//   { path: "/teamOptionUserMain", Component: TeamOptionUserMain },
//   { path: "/rfaUserFirstRoundMain", Component: RFAUserFirstRoundMain },
//   { path: "/rfaUserSecondMain", Component: RFAUserSecondMain },
//   { path: "/rfaUserResultMain", Component: RFAUserResultMain },
//   { path: "/ufaufrFirstStageMain", Component: UFAUFRFirstStageMain },
//   { path: "/ufaufrSecondStageMain", Component: UFAUFRSecondStageMain },
//   {
//     path: "/ufaUserFirstRoundResultMain",
//     Component: UFAUserFirstRoundResultMain,
//   },
//   { path: "/ufaUSRFirstStageMain", Component: UFAUSRFirstStageMain },
//   { path: "/ufaUSRSecondStageMain", Component: UFAUSRSecondStageMain },
//   {
//     path: "/ufaUserSecondRoundResultMain",
//     Component: UFAUserSecondRoundResultMain,
//   },
//   { path: "/ufaUTRFirstStageMain", Component: UFAUTRFirstStageMain },
//   { path: "/ufaUTRSecondStageMain", Component: UFAUTRSecondStageMain },
//   {
//     path: "/ufaUserThirdRoundResultMain",
//     Component: UFAUserThirdRoundResultMain,
//   },
// ];

// /* ------------------------------------------------------------------ */
// /*  Generic / events routes                                           */
// /* ------------------------------------------------------------------ */

// const COMMON_ROUTES: RouteItem[] = [
//   { path: "/maintournament", Component: MainTournament },
//   { path: "/tradesAll", Component: TradesAll },
//   { path: "/draftLotteryMain", Component: DraftLotteryMain },
// ];

// // ------------------------------------------------------------------------
// // chat
// // ----------------------------------------------------------------------------

// // новая группа роутов chat

// const CHAT_ROUTES: RouteItem[] = [
//   {
//     path: "/chat",
//     Component: ChatMain,
//     roles: ["admin", "user"],
//   },
//   {
//     path: "/chat/:channelId",
//     Component: ChatMain,
//     roles: ["admin", "user"],
//   },
// ];

// /* ------------------------------------------------------------------ */
// /*  Helper                                                            */
// /* ------------------------------------------------------------------ */

// function renderRoutes(routes: RouteItem[]) {
//   return routes.map(({ path, Component, roles }) => (
//     <Route
//       key={path}
//       path={path}
//       element={
//         roles ? (
//           <ProtectedRoute roles={roles}>
//             <Component />
//           </ProtectedRoute>
//         ) : (
//           <Component />
//         )
//       }
//     />
//   ));
// }

// /* ------------------------------------------------------------------ */
// /*  Router                                                            */
// /* ------------------------------------------------------------------ */

// function Routing() {
//   return (
//     <AuthProvider>
//       <AuthModalProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* main */}
//             <Route path="/" element={<MainN />} />

//             {/* teams */}
//             {renderRoutes(TEAM_ROUTES)}

//             {/* admin */}
//             {renderRoutes(ADMIN_ROUTES)}

//             {/* user market */}
//             {renderRoutes(USER_MARKET_ROUTES)}

//             {/* common */}
//             {renderRoutes(COMMON_ROUTES)}

//             {/* chat */}
//             {renderRoutes(CHAT_ROUTES)}

//             {/* errors */}
//             <Route path="/403" element={<Forbidden />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//         <AuthModal />
//       </AuthModalProvider>
//     </AuthProvider>
//   );
// }

// export default Routing;

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

import React, { ComponentType } from "react";
// ✅ ИЗМЕНЕНО: BrowserRouter → HashRouter
// ❌ БЫЛО: import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HashRouter, Route, Routes } from "react-router-dom";

// pages
import NotFound from "./tsx/pagesZero/NotFound";
import Forbidden from "./tsx/pagesZero/Forbidden";

// main
import MainN from "./tsx/main/MainGroup/MainN";

// agent control center
import LogsMain from "./tsx/agentControlCenter/logs/LogsMain";
import Penalties from "./tsx/agentControlCenter/penalties/Penalties";
import PlayerConsoleAdminMain from "./tsx/agentControlCenter/playerConsole/PlayerConsoleAdminMain";
import PicksMain from "./tsx/agentControlCenter/picks/PicksMain";
import HeadAdminConsoleMain from "./tsx/agentControlCenter/headConsole/HeadAdminConsoleMain";

// events
import MainTournament from "./tsx/events/tournament/MainTournament";
import TradesAll from "./tsx/events/trades/TreadesAllHeader/TradesAll";
import DraftLotteryMain from "./tsx/events/draftLottery/DraftLotteryMain";

// market — admin
import PlayerOptionMain from "./tsx/market/playerOption/playerOptionAdmin/PlayerOptionMain";
import TeamOptionAdminMain from "./tsx/market/teamOption/teamOptionAdmin/TeamOptionAdminMain";
import RFAAdminMain from "./tsx/market/rfa/rfaAdmin/RFAAdminMain";
import UFAAdminFirstRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminFirstRound/UFAAdminFirstRoundMain";
import UFAAdminSecondRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminSecondRound/UFAAdminSecondRoundMain";
import UFAAdminThirdRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminThirdRound/UFAAdminThirdRoundMain";

// market — user
import PlayerOptionUserMain from "./tsx/market/playerOption/playerOptionUser/PlayerOptionUserMain";
import TeamOptionUserMain from "./tsx/market/teamOption/teamOptionUser/TeamOptionUserMain";
import RFAUserFirstRoundMain from "./tsx/market/rfa/rfaUser/RFAUserFirstRoundFull/RFAUserMain";
import RFAUserSecondMain from "./tsx/market/rfa/rfaUser/RFAUserSecondRoundFull/RFAUserSecondMain";
import RFAUserResultMain from "./tsx/market/rfa/rfaUser/rfaUserResult/RFAUserResultMain";
import UFAUFRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRound/UFAUserFirstRoundFirstStage/UFAUFRFirstStageMain";
import UFAUFRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRound/UFAUserFirstRoundSecondStage/UFAUFRSecondStageMain";
import UFAUserFirstRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRoundResult/UFAUserFirstRoundResultMain";
import UFAUSRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRound/UFAUserSecondRoundFirstStage/UFAUSRFirstStageMain";
import UFAUSRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRound/UFAUserSecondRoundSecondStage/UFAUSRSecondStageMain";
import UFAUserSecondRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRoundResult/UFAUserSecondRoundResultMain";
import UFAUTRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRound/UFAUserThirdRoundFirstStage/UFAUTRFirstStageMain";
import UFAUTRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRound/UFAUserThirdRoundSecondStage/UFAUTRSecondStageMain";
import UFAUserThirdRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRoundResult/UFAUserThirdRoundResultMain";

// teams
import HawksMain from "./tsx/team_new/hawks/HawksMain";
import CelticsMain from "./tsx/team_new/celtics/CelticsMain";
import NetsMain from "./tsx/team_new/nets/NetsMain";
import HornetsMain from "./tsx/team_new/hornets/HornetsMain";
import BullsMain from "./tsx/team_new/bulls/BullsMain";
import CavaliersMain from "./tsx/team_new/cavaliers/CavaliersMain";
import MavericksMain from "./tsx/team_new/mavericks/MavericksMain";
import NuggetsMain from "./tsx/team_new/nuggets/NuggetsMain";
import PistonsMain from "./tsx/team_new/pistons/PistonsMain";
import WarriorsMain from "./tsx/team_new/warriors/WarriorsMain";
import RocketsMain from "./tsx/team_new/rockets/RocketsMain";
import PacersMain from "./tsx/team_new/pacers/PacersMain";
import ClippersMain from "./tsx/team_new/clippers/ClippersMain";
import LakersMain from "./tsx/team_new/lakers/LakersMain";
import GrizzliesMain from "./tsx/team_new/grizzlies/GrizzliesMain";
import HeatMain from "./tsx/team_new/heat/HeatMain";
import BucksMain from "./tsx/team_new/bucks/BucksMain";
import TimberwolvesMain from "./tsx/team_new/timberwolves/TimberwolvesMain";
import PelicansMain from "./tsx/team_new/pelicans/PelicansMain";
import KnicksMain from "./tsx/team_new/knicks/KnicksMain";
import ThunderMain from "./tsx/team_new/thunder/ThunderMain";
import MagicMain from "./tsx/team_new/magic/MagicMain";
import SevsixMain from "./tsx/team_new/sevsix/SevsixMain";
import SunsMain from "./tsx/team_new/suns/SunsMain";
import BlazersMain from "./tsx/team_new/blazers/BlazersMain";
import KingsMain from "./tsx/team_new/kings/KingsMain";
import RaptorsMain from "./tsx/team_new/raptors/RaptorsMain";
import JazzMain from "./tsx/team_new/jazz/JazzMain";
import WizardsMain from "./tsx/team_new/wizards/WizardsMain";
import SpursMain from "./tsx/team_new/spurs/SpursMain";

// auth

import { AuthProvider } from "./tsx/authorization/AuthContext";
import { AuthModalProvider } from "./tsx/authorization/AuthModalContext";
import ProtectedRoute from "./tsx/authorization/ProtectedRoute";
import AuthModal from "./tsx/authorization/AuthModal";

// chat
import ChatMain from "./tsx/chat/ChatMain";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type RouteItem = {
  path: string;
  Component: ComponentType;
  roles?: string[];
};

/* ------------------------------------------------------------------ */
/*  Teams                                                             */
/* ------------------------------------------------------------------ */

const TEAM_ROUTES: RouteItem[] = [
  { path: "/hawksMain", Component: HawksMain },
  { path: "/celticsMain", Component: CelticsMain },
  { path: "/netsMain", Component: NetsMain },
  { path: "/hornetsMain", Component: HornetsMain },
  { path: "/bullsMain", Component: BullsMain },
  { path: "/cavaliersMain", Component: CavaliersMain },
  { path: "/mavericksMain", Component: MavericksMain },
  { path: "/nuggetsMain", Component: NuggetsMain },
  { path: "/pistonsMain", Component: PistonsMain },
  { path: "/warriorsMain", Component: WarriorsMain },
  { path: "/rocketsMain", Component: RocketsMain },
  { path: "/pacersMain", Component: PacersMain },
  { path: "/clippersMain", Component: ClippersMain },
  { path: "/lakersMain", Component: LakersMain },
  { path: "/grizzliesMain", Component: GrizzliesMain },
  { path: "/heatMain", Component: HeatMain },
  { path: "/bucksMain", Component: BucksMain },
  { path: "/timberwolvesMain", Component: TimberwolvesMain },
  { path: "/pelicansMain", Component: PelicansMain },
  { path: "/knicksMain", Component: KnicksMain },
  { path: "/thunderMain", Component: ThunderMain },
  { path: "/magicMain", Component: MagicMain },
  { path: "/sevsixMain", Component: SevsixMain },
  { path: "/sunsMain", Component: SunsMain },
  { path: "/blazersMain", Component: BlazersMain },
  { path: "/kingsMain", Component: KingsMain },
  { path: "/spursMain", Component: SpursMain },
  { path: "/raptorsMain", Component: RaptorsMain },
  { path: "/jazzMain", Component: JazzMain },
  { path: "/wizardsMain", Component: WizardsMain },
];

/* ------------------------------------------------------------------ */
/*  Admin routes                                                      */
/* ------------------------------------------------------------------ */

const ADMIN_ROUTES: RouteItem[] = [
  {
    path: "/headAdminConsoleMain",
    Component: HeadAdminConsoleMain,
    roles: ["admin", "user"],
  },
  {
    path: "/playerConsoleAdminMain",
    Component: PlayerConsoleAdminMain,
    roles: ["admin", "user"],
  },

  { path: "/picksMain", Component: PicksMain, roles: ["admin", "user"] },
  { path: "/logs", Component: LogsMain },
  { path: "/penalties", Component: Penalties },
  { path: "/playerOptionMain", Component: PlayerOptionMain },
  { path: "/teamOptionMain", Component: TeamOptionAdminMain },
  { path: "/rfaAdminMain", Component: RFAAdminMain },
  { path: "/ufaAdminFirstRoundMain", Component: UFAAdminFirstRoundMain },
  { path: "/ufaAdminSecondRoundMain", Component: UFAAdminSecondRoundMain },
  { path: "/ufaAdminThirdRoundMain", Component: UFAAdminThirdRoundMain },
];

/* ------------------------------------------------------------------ */
/*  User market routes                                                */
/* ------------------------------------------------------------------ */

const USER_MARKET_ROUTES: RouteItem[] = [
  { path: "/playerOptionUserMain", Component: PlayerOptionUserMain },
  { path: "/teamOptionUserMain", Component: TeamOptionUserMain },
  { path: "/rfaUserFirstRoundMain", Component: RFAUserFirstRoundMain },
  { path: "/rfaUserSecondMain", Component: RFAUserSecondMain },
  { path: "/rfaUserResultMain", Component: RFAUserResultMain },
  { path: "/ufaufrFirstStageMain", Component: UFAUFRFirstStageMain },
  { path: "/ufaufrSecondStageMain", Component: UFAUFRSecondStageMain },
  {
    path: "/ufaUserFirstRoundResultMain",
    Component: UFAUserFirstRoundResultMain,
  },
  { path: "/ufaUSRFirstStageMain", Component: UFAUSRFirstStageMain },
  { path: "/ufaUSRSecondStageMain", Component: UFAUSRSecondStageMain },
  {
    path: "/ufaUserSecondRoundResultMain",
    Component: UFAUserSecondRoundResultMain,
  },
  { path: "/ufaUTRFirstStageMain", Component: UFAUTRFirstStageMain },
  { path: "/ufaUTRSecondStageMain", Component: UFAUTRSecondStageMain },
  {
    path: "/ufaUserThirdRoundResultMain",
    Component: UFAUserThirdRoundResultMain,
  },
];

/* ------------------------------------------------------------------ */
/*  Generic / events routes                                           */
/* ------------------------------------------------------------------ */

const COMMON_ROUTES: RouteItem[] = [
  { path: "/maintournament", Component: MainTournament },
  { path: "/tradesAll", Component: TradesAll },
  { path: "/draftLotteryMain", Component: DraftLotteryMain },
];

/* ------------------------------------------------------------------ */
/*  Chat routes                                                       */
/* ------------------------------------------------------------------ */

// ✅ ИЗМЕНЕНО: /chat → /talk (InfinityFree блокирует URL со словом "chat" → 403)
// ❌ БЫЛО:
// const CHAT_ROUTES: RouteItem[] = [
//   { path: "/chat", Component: ChatMain, roles: ["admin", "user"] },
//   { path: "/chat/:channelId", Component: ChatMain, roles: ["admin", "user"] },
// ];
const CHAT_ROUTES: RouteItem[] = [
  {
    path: "/talk",
    Component: ChatMain,
    roles: ["admin", "user"],
  },
  {
    path: "/talk/:channelId",
    Component: ChatMain,
    roles: ["admin", "user"],
  },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

function renderRoutes(routes: RouteItem[]) {
  return routes.map(({ path, Component, roles }) => (
    <Route
      key={path}
      path={path}
      element={
        roles ? (
          <ProtectedRoute roles={roles}>
            <Component />
          </ProtectedRoute>
        ) : (
          <Component />
        )
      }
    />
  ));
}

/* ------------------------------------------------------------------ */
/*  Router                                                            */
/* ------------------------------------------------------------------ */

function Routing() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        {/* ✅ ИЗМЕНЕНО: BrowserRouter → HashRouter */}
        {/* ❌ БЫЛО: <BrowserRouter> ... </BrowserRouter> */}
        <HashRouter>
          <Routes>
            {/* main */}
            <Route path="/" element={<MainN />} />

            {/* teams */}
            {renderRoutes(TEAM_ROUTES)}

            {/* admin */}
            {renderRoutes(ADMIN_ROUTES)}

            {/* user market */}
            {renderRoutes(USER_MARKET_ROUTES)}

            {/* common */}
            {renderRoutes(COMMON_ROUTES)}

            {/* chat */}
            {renderRoutes(CHAT_ROUTES)}

            {/* errors */}
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
        <AuthModal />
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default Routing;
