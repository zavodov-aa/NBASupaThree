import React from "react";
import PlayerOptionHeader from "../../playerOption/playerOptionAdmin/PlayerOptionHeader";
import RFAAdminOffers from "./RFAAdminOffers";
import RFAAdminOffersResult from "./RFAAdminOffersResult";
import RFAAdminOffersSecondRound from "./RFAAdminOffersSecondRound";
import RFAAdminOffersSecondRoundResult from "./RFAAdminOffersSecondRoundResult";
import RFAFinalDecision from "./RFAFinalDecision";

const RFAAdminMain = () => {
  return (
    <>
      <PlayerOptionHeader />
      <RFAAdminOffers />
      <RFAAdminOffersResult />
      <RFAAdminOffersSecondRound />
      <RFAAdminOffersSecondRoundResult />
      <RFAFinalDecision />
    </>
  );
};

export default RFAAdminMain;
