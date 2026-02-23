import React from "react";
import PlayerOptionHeader from "../../../playerOption/playerOptionAdmin/PlayerOptionHeader";
import UFAAdminFifthStageOffers from "./UFAAdminFifthStageOffers";
import UFAAdminFifthStageOffersResult from "./UFAAdminFifthStageOffersResult";
import UFAAdminSixthStageOffers from "./UFAAdminSixthStageOffers";
import UFAAdminSixthStageOffersResult from "./UFAAdminSixthStageOffersResult";
import UFAAdminThirdRoundFinalDecision from "./UFAAdminThirdRoundFinalDecision";

const UFAAdminThirdRoundMain = () => {
  return (
    <>
      <PlayerOptionHeader />
      <UFAAdminFifthStageOffers />
      <UFAAdminFifthStageOffersResult />
      <UFAAdminSixthStageOffers />
      <UFAAdminSixthStageOffersResult />
      <UFAAdminThirdRoundFinalDecision />
    </>
  );
};

export default UFAAdminThirdRoundMain;
