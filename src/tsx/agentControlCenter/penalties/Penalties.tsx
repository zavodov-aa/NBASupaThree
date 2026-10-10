import React from "react";
import HeaderPenalties from "./archive/HeaderPenalties";
import BodyPenalties from "./BodyPenalties";
import "./penalties.css";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";

const Penalties = () => {
  return (
    <div>
      {/* <HeaderPenalties /> */}
      <PlayerOptionHeader />
      <BodyPenalties />
    </div>
  );
};

export default Penalties;
