import React from "react";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
import PicksBody from "./picksBody/PicksBody";

const PicksMain = () => {
  return (
    <>
      <PlayerOptionHeader />
      <h1>Пики команд</h1>
      <p>Просмотр и редактирование (интегрирован в "Roster new")</p>
      <PicksBody />
    </>
  );
};

export default PicksMain;
