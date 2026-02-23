import React from "react";
import PlayerOptionHeaderUser from "../../../playerOption/playerOptionUser/PlayerOptionHeaderUser";
// import RFAUserFirstRound from "./RFAUserFirstRound";
import RFAUserFirstRoundSpace from "../archiveFirstRound/RFAUserFirstRoundSpace";
import RFAUserFirstRoundSpaceViewOffers from "./RFAUserFirstRoundSpaceViewOffers";
import RFAUserFirstRoundTest from "./RFAUserFirstRoundSpaceTest";
// import RFAUserFirstRoundSpaceMore from "./RFAUserFirstRoundSpaceViewOffers";
// import RFAUserFirstRoundSpaceViewOffers from "./RFAUserFirstRoundSpaceViewOffers";

const RFAUserFirstRoundMain = () => {
  return (
    <>
      <PlayerOptionHeaderUser />
      <RFAUserFirstRoundSpaceViewOffers />

      {/* <RFAUserFirstRoundSpace /> */}
      <RFAUserFirstRoundTest />
    </>
  );
};

export default RFAUserFirstRoundMain;
