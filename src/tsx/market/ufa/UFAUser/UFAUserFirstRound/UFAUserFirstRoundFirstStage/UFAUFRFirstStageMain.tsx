import React from "react";
import UFAUFRFirstStageForm from "./UFAUFRFirstStageForm";
import PlayerOptionHeaderUser from "../../../../playerOption/playerOptionUser/PlayerOptionHeaderUser";
import UFAUFRFirstStageViewOffers from "./UFAUFRFirstStageViewOffers";

const UFAUFRFirstStageMain = () => {
  return (
    <>
      <PlayerOptionHeaderUser />
      <UFAUFRFirstStageViewOffers />
      <UFAUFRFirstStageForm />
    </>
  );
};

export default UFAUFRFirstStageMain;
