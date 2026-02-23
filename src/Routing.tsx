import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./tsx/main/Main";
import Lakers from "./tsx/team/lakers/Lakers";
import HeadInfoAgentControlCenter from "./tsx/agentControlCenter/HeadInfoAgentControlCenter";
// import PlayersRosterAgentControlCenter from "./tsx/agentControlCenter/PlayersRosterAgentControlCenter";
import DeadCapRosterAgentControl from "./tsx/agentControlCenter/DeadCapRosterAgentControl";
import Hawks from "./tsx/team/hawks/Hawks";
import Celtics from "./tsx/team/celtics/Celtics";
import Nets from "./tsx/team/nets/Nets";
import Hornets from "./tsx/team/hornets/Hornets";
import Bulls from "./tsx/team/bulls/Bulls";
import Cavalers from "./tsx/team/cavalers/Cavaliers";
import Mavericks from "./tsx/team/mavericks/Mavericks";
import Nuggets from "./tsx/team/nuggets/Nuggets";
import Pistons from "./tsx/team/pistons/Pistons";
import Warriors from "./tsx/team/warriors/Warriors";
import Rockets from "./tsx/team/rockets/Rockets";
import Pacers from "./tsx/team/pacers/Pacers";
import Clippers from "./tsx/team/clippers/Clippers";
import Grizzlies from "./tsx/team/grizzlies/Grizzlies";
import Heat from "./tsx/team/heat/Heat";
import Bucks from "./tsx/team/bucks/Bucks";
import Timberwolves from "./tsx/team/timberwolves/Timberwolves";
import Pelicans from "./tsx/team/pelicans/Pelicans";
import Knicks from "./tsx/team/knicks/Knicks";
import Thunder from "./tsx/team/thunder/Thunder";
import Magic from "./tsx/team/magic/Magic";
import Sevsix from "./tsx/team/76ers/Sevsix";
import Suns from "./tsx/team/suns/Suns";
import Blazers from "./tsx/team/blazers/Blazers";
import Kings from "./tsx/team/kings/Kings";
import Spurs from "./tsx/team/spurs/Spurs";
import Raptors from "./tsx/team/raptors/Raptors";
import Jazz from "./tsx/team/jazz/Jazz";
import Wizards from "./tsx/team/wizards/Wizards";
import Logs from "./tsx/agentControlCenter/logs/logs";
import LogsMain from "./tsx/agentControlCenter/logs/LogsMain";
import MainTournament from "./tsx/events/tournament/MainTournament";
import Penalties from "./tsx/agentControlCenter/penalties/Penalties";
// import PlayersRosterAgentControlCenterFix from "./tsx/agentControlCenter/PlayersRosterAgentControlCenterFix";
import PlayersRosterAgentControlCenterFixTwo from "./tsx/agentControlCenter/PlayersRosterAgentControlCenterFixTwo";
import PlayersRosterAgentControlCenterFix from "./tsx/agentControlCenter/PlayersRosterAgentControlCenterFix";
import PlayersRosterAgentControlCenterFixThreeArchive from "./tsx/agentControlCenter/PlayersRosterAgentControlCenterFixThreeArchive";
import TradesAll from "./tsx/events/trades/TreadesAllHeader/TradesAll";
import PlayerOption from "./tsx/market/playerOption/playerOptionAdmin/PlayerOption";
import PlayerOptionMain from "./tsx/market/playerOption/playerOptionAdmin/PlayerOptionMain";
import PlayerOptionUserMain from "./tsx/market/playerOption/playerOptionUser/PlayerOptionUserMain";
import TeamOptionUser from "./tsx/market/teamOption/teamOptionUser/TeamOptionUser";
import TeamOptionUserMain from "./tsx/market/teamOption/teamOptionUser/TeamOptionUserMain";
import TeamOptionAdminMain from "./tsx/market/teamOption/teamOptionAdmin/TeamOptionAdminMain";
import RFAUserFirstRoundMain from "./tsx/market/rfa/rfaUser/RFAUserFirstRoundFull/RFAUserMain";
import RFAAdminMain from "./tsx/market/rfa/rfaAdmin/RFAAdminMain";
import RFAUserResultMain from "./tsx/market/rfa/rfaUser/rfaUserResult/RFAUserResultMain";
import RFAUserSecondMain from "./tsx/market/rfa/rfaUser/RFAUserSecondRoundFull/RFAUserSecondMain";
import UFAUFRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRound/UFAUserFirstRoundFirstStage/UFAUFRFirstStageMain";
import UFAUFRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRound/UFAUserFirstRoundSecondStage/UFAUFRSecondStageMain";
import UFAAdminFirstRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminFirstRound/UFAAdminFirstRoundMain";
import UFAUserFirstRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserFirstRoundResult/UFAUserFirstRoundResultMain";
import UFAUSRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRound/UFAUserSecondRoundFirstStage/UFAUSRFirstStageMain";
import UFAUSRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRound/UFAUserSecondRoundSecondStage/UFAUSRSecondStageMain";
import UFAAdminSecondRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminSecondRound/UFAAdminSecondRoundMain";
import UFAUserSecondRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserSecondRoundResult/UFAUserSecondRoundResultMain";
import UFAUTRFirstStageMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRound/UFAUserThirdRoundFirstStage/UFAUTRFirstStageMain";
import UFAUTRSecondStageMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRound/UFAUserThirdRoundSecondStage/UFAUTRSecondStageMain";
import UFAAdminThirdRoundMain from "./tsx/market/ufa/UFAAdmin/UFAAdminThirdRound/UFAAdminThirdRoundMain";
import UFAUserThirdRoundResultMain from "./tsx/market/ufa/UFAUser/UFAUserThirdRoundResult/UFAUserThirdRoundResultMain";
import DraftLotteryMain from "./tsx/events/draftLottery/DraftLotteryMain";

// import TradesMain from "./tsx/events/trades/TreadesAllHeader/TradesMain";

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />

        {/* team  */}
        <Route path="/hawks" element={<Hawks />} />
        <Route path="/celtics" element={<Celtics />} />
        <Route path="/nets" element={<Nets />} />
        <Route path="/hornets" element={<Hornets />} />
        <Route path="/bulls" element={<Bulls />} />
        <Route path="/cavalers" element={<Cavalers />} />
        <Route path="/mavericks" element={<Mavericks />} />
        <Route path="/nuggets" element={<Nuggets />} />
        <Route path="/pistons" element={<Pistons />} />
        <Route path="/warriors" element={<Warriors />} />
        <Route path="/rockets" element={<Rockets />} />
        <Route path="/pacers" element={<Pacers />} />
        <Route path="/clippers" element={<Clippers />} />
        <Route path="/lakers" element={<Lakers />} />
        <Route path="/grizzlies" element={<Grizzlies />} />
        <Route path="/heat" element={<Heat />} />
        <Route path="/bucks" element={<Bucks />} />
        <Route path="/timberwolves" element={<Timberwolves />} />
        <Route path="/pelicans" element={<Pelicans />} />
        <Route path="/knicks" element={<Knicks />} />
        <Route path="/thunder" element={<Thunder />} />
        <Route path="/magic" element={<Magic />} />
        <Route path="/sevsix" element={<Sevsix />} />
        <Route path="/suns" element={<Suns />} />
        <Route path="/blazers" element={<Blazers />} />
        <Route path="/kings" element={<Kings />} />
        <Route path="/spurs" element={<Spurs />} />
        <Route path="/raptors" element={<Raptors />} />
        <Route path="/jazz" element={<Jazz />} />
        <Route path="/wizards" element={<Wizards />} />

        {/* agentConsole */}
        <Route
          path="/headInfoAgentControlCenter"
          element={<HeadInfoAgentControlCenter />}
        />
        <Route
          path="/playersRosterAgentControlCenter"
          element={<PlayersRosterAgentControlCenterFixThreeArchive />}
        />
        <Route
          path="/deadCapRosterAgentControl"
          element={<DeadCapRosterAgentControl />}
        />
        {/* <Route path="/logs" element={<Logs />} /> */}
        <Route path="/logs" element={<LogsMain />} />
        <Route path="/penalties" element={<Penalties />} />
        <Route path="/playerOptionMain" element={<PlayerOptionMain />} />
        <Route path="/teamOptionMain" element={<TeamOptionAdminMain />} />
        <Route path="/rfaAdminMain" element={<RFAAdminMain />} />
        <Route
          path="/ufaAdminFirstRoundMain"
          element={<UFAAdminFirstRoundMain />}
        />
        <Route
          path="/ufaAdminSecondRoundMain"
          element={<UFAAdminSecondRoundMain />}
        />
        <Route
          path="/ufaAdminThirdRoundMain"
          element={<UFAAdminThirdRoundMain />}
        />

        {/* {events} */}

        <Route path="/maintournament" element={<MainTournament />} />
        <Route path="/tradesAll" element={<TradesAll />} />
        {/* <Route path="/tradesAll" element={<TradesMain />} /> */}
        <Route path="/draftLotteryMain" element={<DraftLotteryMain />} />

        {/* market */}

        <Route
          path="/playerOptionUserMain"
          element={<PlayerOptionUserMain />}
        />
        {/* <Route path="/teamOptionUser" element={<TeamOptionUser />} /> */}
        <Route path="/teamOptionUserMain" element={<TeamOptionUserMain />} />
        <Route
          path="/rfaUserFirstRoundMain"
          element={<RFAUserFirstRoundMain />}
        />
        <Route path="/rfaUserSecondMain" element={<RFAUserSecondMain />} />
        <Route path="/rfaUserResultMain" element={<RFAUserResultMain />} />
        <Route
          path="/ufaufrFirstStageMain"
          element={<UFAUFRFirstStageMain />}
        />
        <Route
          path="/ufaufrSecondStageMain"
          element={<UFAUFRSecondStageMain />}
        />
        <Route
          path="/ufaUserFirstRoundResultMain"
          element={<UFAUserFirstRoundResultMain />}
        />
        <Route
          path="/ufaUSRFirstStageMain"
          element={<UFAUSRFirstStageMain />}
        />
        <Route
          path="/ufaUSRSecondStageMain"
          element={<UFAUSRSecondStageMain />}
        />
        <Route
          path="/ufaUserSecondRoundResultMain"
          element={<UFAUserSecondRoundResultMain />}
        />
        <Route
          path="/ufaUTRFirstStageMain"
          element={<UFAUTRFirstStageMain />}
        />
        <Route
          path="/ufaUTRSecondStageMain"
          element={<UFAUTRSecondStageMain />}
        />
        <Route
          path="/ufaUserThirdRoundResultMain"
          element={<UFAUserThirdRoundResultMain />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
