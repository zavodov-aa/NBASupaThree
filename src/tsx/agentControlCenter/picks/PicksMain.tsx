import React from "react";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
import PicksBody from "./picksBody/PicksBody";
import CashBody from "./cashBody/CashBody";

// 👈 ДОБАВЛЕНО: импорт хука роли
import { useRole } from "../../authorization/useRole";

const PicksMain = () => {
  // 👈 ДОБАВЛЕНО: определяем роль и readOnly
  const { isAdmin } = useRole();
  const readOnly = !isAdmin;

  return (
    <>
      {/* Хедер — чисто навигация, readOnly не нужен */}
      <PlayerOptionHeader />

      <h1>Пики команд</h1>
      <p>Просмотр и редактирование (интегрирован в "Roster new")</p>
      {/* 👈 readOnly прокидываем только в тело с редактированием */}
      <PicksBody readOnly={readOnly} />

      <h1>Кэш</h1>
      <p>Просмотр и редактирование (интегрирован в "Roster new")</p>
      {/* 👈 readOnly прокидываем только в тело с редактированием */}
      <CashBody readOnly={readOnly} />
    </>
  );
};

export default PicksMain;
