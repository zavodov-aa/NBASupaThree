import React from "react";
import PlayerOptionHeaderUser from "../../../../playerOption/playerOptionUser/PlayerOptionHeaderUser";
import UFAUFRSecondStageForm from "./UFAUFRSecondStageForm";
import UFAUFRSecondStageViewOffers from "./UFAUFRSecondStageViewOffers";

const UFAUFRSecondStageMain = () => {
  return (
    <>
      <PlayerOptionHeaderUser />
      <UFAUFRSecondStageViewOffers />
      <UFAUFRSecondStageForm />
    </>
  );
};

export default UFAUFRSecondStageMain;
