import React from "react";
import PlayerOptionHeader from "../../../playerOption/playerOptionAdmin/PlayerOptionHeader";
import UFAAdminFirstStageOffers from "./UFAAdminFirstStageOffers";
import UFAAdminFirstStageOffersResult from "./UFAAdminFirstStageOffersResult";
import UFAAdminSecondStageOffers from "./UFAAdminSecondStageOffers";
import UFAAdminSecondStageOffersResult from "./UFAAdminSecondStageOffersResult";
import UFAAdminFirstRoundFinalDecision from "./UFAAdminFirstRoundFinalDecision";

const UFAAdminFirstRoundMain = () => {
  return (
    <>
      <PlayerOptionHeader />
      <UFAAdminFirstStageOffers />
      <UFAAdminFirstStageOffersResult />
      <UFAAdminSecondStageOffers />
      <UFAAdminSecondStageOffersResult />
      <UFAAdminFirstRoundFinalDecision />
    </>
  );
};

export default UFAAdminFirstRoundMain;
