import React from "react";
import PlayerOptionHeaderUser from "../../../playerOption/playerOptionUser/PlayerOptionHeaderUser";
import RFAResultFirstRound from "./RFAResultFirstRound";
import RFAResultSecondRound from "./RFAResultSecondRound";
import RFAResultFullRound from "./RFAResultFullRound";
import RFAUserFinalDecision from "./RFAUserFinalDecision";

const RFAUserResultMain = () => {
  return (
    <>
      <PlayerOptionHeaderUser />
      {/* <RFAResultFirstRound /> */}
      {/* <RFAResultSecondRound /> */}
      <RFAResultFullRound />
      <RFAUserFinalDecision />
    </>
  );
};

export default RFAUserResultMain;
