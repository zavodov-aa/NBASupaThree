import React from "react";
import PlayerOptionHeader from "../../../playerOption/playerOptionAdmin/PlayerOptionHeader";
import UFAAdminThirdStageOffers from "./UFAAdminThirdStageOffers";
import UFAAdminThirdStageOffersResult from "./UFAAdminThirdStageOffersResult";
import UFAAdminFourthStageOffers from "./UFAAdminFourthStageOffers";
import UFAAdminFourthStageOffersResult from "./UFAAdminFourthStageOffersResult";
import UFAAdminSecondRoundFinalDecision from "./UFAAdminSecondRoundFinalDecision";

const UFAAdminSecondRoundMain = () => {
  return (
    <>
      <PlayerOptionHeader />
      <UFAAdminThirdStageOffers />
      <UFAAdminThirdStageOffersResult />
      <UFAAdminFourthStageOffers />
      <UFAAdminFourthStageOffersResult />
      <UFAAdminSecondRoundFinalDecision />
    </>
  );
};

export default UFAAdminSecondRoundMain;
