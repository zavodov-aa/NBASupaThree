// import React, { useState } from "react";
// import { useMobile } from "./playerComponents/hooks/useMobile";
// import { useArchive } from "./playerComponents/hooks/useArchive";
// import { usePlayers } from "./playerComponents/hooks/usePlayers";
// import { useFilters } from "./playerComponents/hooks/useFilters";
// import { useEditing } from "./playerComponents/hooks/useEditing";
// import { useAddPlayer } from "./playerComponents/hooks/useAddPlayer";
// import { useColumnVisibility } from "./playerComponents/hooks/useColumnVisibility";
// import { useContextMenu } from "./playerComponents/hooks/useContextMenu";
// import MassShiftModal from "./playerComponents/playerForArchiveMain/PlayerConsoleAdminArchiveComp";
// import { TeamContextMenu } from "./playerComponents/components/TeamContextMenu";
// import { GLeagueContextMenu } from "./playerComponents/components/GLeagueContextMenu";
// import { FiltersPanel } from "./playerComponents/components/FiltersPanel";
// import { MobileHeader } from "./playerComponents/components/MobileHeader";
// import { DesktopHeader } from "./playerComponents/components/DesktopHeader";
// import { PlayersTable } from "./playerComponents/components/PlayersTable";
// import ColumnSelector from "./playerComponents/playerColumnSelectorMain/PlayerColumnSelectorMain";
// import { Player } from "./playerComponents/types/Player";
// import { supabase } from "../../../Supabase";
// import "../playersRosterAgentControlCenter.css";

// const PlayersRosterAgentControlCenter = () => {
//   const isMobile = useMobile();
//   const { archiveInitialized, initializeArchiveTable } = useArchive();
//   const { players, setPlayers, addPlayer, updatePlayer } = usePlayers();
//   const { filters, handleFilterChange, resetFilters, filteredPlayers } =
//     useFilters(players);
//   const {
//     editingId,
//     editData,
//     startEdit,
//     handleEditDataChange,
//     saveEdit,
//     cancelEdit,
//   } = useEditing(updatePlayer, players, setPlayers);
//   const {
//     isAddingNew,
//     newPlayer,
//     startAdd,
//     handleNewPlayerChange,
//     addNewPlayer,
//     cancelAdd,
//   } = useAddPlayer(addPlayer);
//   const {
//     visibleColumns,
//     visibleColumnsArray,
//     visibleColumnsWithoutId,
//     toggleColumn,
//     selectAll,
//     deselectAll,
//     selectGroup,
//     deselectGroup,
//     columnGroups,
//   } = useColumnVisibility();

//   const teamMenu = useContextMenu();
//   const gLeagueMenu = useContextMenu();

//   const [showFilters, setShowFilters] = useState(false);
//   const [showColumnSelector, setShowColumnSelector] = useState(false);
//   const [showMassShiftModal, setShowMassShiftModal] = useState(false);

//   // Обработчик для повышения возраста всех игроков, кроме игрока с id = 1
//   const handleIncrementAge = async () => {
//     // Запрос пароля
//     const password = window.prompt(
//       "Введите пароль для подтверждения повышения возраста:",
//     );
//     if (password === null) {
//       // Пользователь нажал "Отмена"
//       return;
//     }
//     if (password !== "1") {
//       alert("Неверный пароль. Операция отменена.");
//       return;
//     }

//     try {
//       // Формируем массив промисов для обновления каждого игрока (кроме id=1)
//       const updatePromises = players
//         .filter((player) => player.id !== 1)
//         .map((player) => {
//           const newAge =
//             player.age != null ? (Number(player.age) + 1).toString() : null;
//           // updatePlayer сам обновит локальный стейт после ответа от сервера
//           return updatePlayer(player.id, { age: newAge });
//         });

//       await Promise.all(updatePromises);

//       // Уведомление об успехе
//       if (isMobile) {
//         alert("Возраст всех игроков (кроме ID 1) успешно повышен и сохранён");
//       } else {
//         alert("✅ Возраст всех игроков успешно обновлён в базе данных");
//       }
//     } catch (error) {
//       console.error("Ошибка при сохранении возраста:", error);
//       alert("❌ Ошибка при сохранении возраста. Попробуйте ещё раз.");
//     }
//   };

//   const handleShiftClick = async () => {
//     if (!archiveInitialized) {
//       const warningMessage = isMobile
//         ? "Архивная таблица не настроена. Настроить?"
//         : '⚠️ ВНИМАНИЕ: Архивная таблица "Archive_players_years_money" не настроена!\n\n' +
//           "Рекомендуется сначала создать таблицу для сохранения резервных копий данных.\n\n" +
//           "Создать таблицу через SQL Editor? (Рекомендуется для безопасности данных)";

//       if (window.confirm(warningMessage)) {
//         const sqlCommand = `
// CREATE TABLE IF NOT EXISTS Archive_players_years_money (
//   id BIGSERIAL PRIMARY KEY,
//   player_id INTEGER NOT NULL,
//   active_roster VARCHAR(50),
//   year_one TEXT,
//   year_two TEXT,
//   year_three TEXT,
//   year_four TEXT,
//   year_five TEXT,
//   team VARCHAR(255),
//   backup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   operation VARCHAR(50) NOT NULL,
//   original_values JSONB,
//   backup_values JSONB,
//   metadata JSONB DEFAULT '{}'::jsonb
// );`;

//         window.alert(
//           isMobile
//             ? "Скопируйте SQL команду для создания таблицы:"
//             : `📋 SQL команда для создания архивной таблицы:\n\n${sqlCommand}\n\n` +
//                 `Инструкция:\n` +
//                 `1. Откройте Supabase Dashboard\n` +
//                 `2. Перейдите в SQL Editor\n` +
//                 `3. Вставьте команду и выполните\n` +
//                 `4. После создания таблицы повторите операцию`,
//         );

//         await navigator.clipboard.writeText(sqlCommand);
//         return;
//       }
//     }

//     setShowMassShiftModal(true);
//   };

//   const handleTeamCellClick = (
//     e: React.MouseEvent,
//     playerId: number,
//     isNew: boolean,
//   ) => {
//     teamMenu.openMenu(e, playerId, isNew);
//   };

//   const handleGLeagueCellClick = (
//     e: React.MouseEvent,
//     playerId: number,
//     isNew: boolean,
//   ) => {
//     gLeagueMenu.openMenu(e, playerId, isNew);
//   };

//   const handleTeamSelect = (team: string) => {
//     if (teamMenu.isNewPlayer) {
//       handleNewPlayerChange("team", team);
//     } else {
//       handleEditDataChange("team", team);
//     }
//     teamMenu.closeMenu();
//   };

//   const handleGLeagueSelect = (g_league: string) => {
//     if (gLeagueMenu.isNewPlayer) {
//       handleNewPlayerChange("g_league", g_league);
//     } else {
//       handleEditDataChange("g_league", g_league);
//     }
//     gLeagueMenu.closeMenu();
//   };

//   const handleMassShiftSuccess = (updatedPlayers: Player[]) => {
//     setPlayers(updatedPlayers);
//     setShowMassShiftModal(false);
//   };

//   const handleMassShiftError = (error: Error) => {
//     console.error("Mass shift error:", error);
//     window.alert(
//       isMobile
//         ? "Ошибка при переносе данных!"
//         : `❌ Произошла ошибка: ${error.message}`,
//     );
//   };

//   return (
//     <div className="playersRosterAgentControlCenter-container">
//       <MassShiftModal
//         isOpen={showMassShiftModal}
//         onClose={() => setShowMassShiftModal(false)}
//         players={players}
//         supabase={supabase}
//         archiveInitialized={archiveInitialized}
//         isMobile={isMobile}
//         showConfirm={window.confirm}
//         showAlert={window.alert}
//         onSuccess={handleMassShiftSuccess}
//         onError={handleMassShiftError}
//       />

//       <TeamContextMenu
//         show={teamMenu.show}
//         x={teamMenu.x}
//         y={teamMenu.y}
//         searchQuery={teamMenu.searchQuery}
//         onSearchChange={teamMenu.setSearchQuery}
//         onSelect={handleTeamSelect}
//         onClose={teamMenu.closeMenu}
//         isMobile={isMobile}
//       />

//       <GLeagueContextMenu
//         show={gLeagueMenu.show}
//         x={gLeagueMenu.x}
//         y={gLeagueMenu.y}
//         searchQuery={gLeagueMenu.searchQuery}
//         onSearchChange={gLeagueMenu.setSearchQuery}
//         onSelect={handleGLeagueSelect}
//         onClose={gLeagueMenu.closeMenu}
//         isMobile={isMobile}
//       />

//       {isMobile ? (
//         <MobileHeader
//           showColumnSelector={showColumnSelector}
//           onToggleColumnSelector={() =>
//             setShowColumnSelector(!showColumnSelector)
//           }
//         />
//       ) : (
//         <DesktopHeader onAddClick={startAdd} />
//       )}

//       {(showColumnSelector || !isMobile) && (
//         <ColumnSelector
//           visibleColumns={visibleColumns}
//           onToggleColumn={toggleColumn}
//           onSelectAll={selectAll}
//           onDeselectAll={deselectAll}
//           columnGroups={columnGroups}
//           onSelectGroup={selectGroup}
//           onDeselectGroup={deselectGroup}
//           isMobile={isMobile}
//         />
//       )}

//       {isMobile && (
//         <div className="playersRosterAgentControlCenter-mobile-view-controls">
//           <button
//             className="playersRosterAgentControlCenter-view-button"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             {showFilters ? "Hide Filters" : "Show Filters"}
//           </button>
//           <button
//             className="playersRosterAgentControlCenter-view-button playersRosterAgentControlCenter-successButton"
//             onClick={startAdd}
//           >
//             + Add
//           </button>
//         </div>
//       )}

//       {(showFilters || !isMobile) && (
//         <FiltersPanel
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onReset={resetFilters}
//           filteredCount={filteredPlayers.length}
//           totalCount={players.length}
//           showFilters={showFilters}
//           onToggleFilters={() => setShowFilters(!showFilters)}
//           isMobile={isMobile}
//         />
//       )}

//       <PlayersTable
//         players={filteredPlayers}
//         visibleColumns={visibleColumnsArray}
//         isAddingNew={isAddingNew}
//         newPlayer={newPlayer}
//         editingId={editingId}
//         editData={editData}
//         onEdit={startEdit}
//         onSave={saveEdit}
//         onCancel={cancelEdit}
//         onAddNew={addNewPlayer}
//         onCancelAdd={cancelAdd}
//         onTeamCellClick={handleTeamCellClick}
//         onGLeagueCellClick={handleGLeagueCellClick}
//         onEditDataChange={handleEditDataChange}
//         onNewPlayerChange={handleNewPlayerChange}
//         isMobile={isMobile}
//         onIncrementAge={handleIncrementAge}
//       />
//     </div>
//   );
// };

// export default PlayersRosterAgentControlCenter;
import React, { useState } from "react";
import { useMobile } from "./playerComponents/hooks/useMobile";
import { useArchive } from "./playerComponents/hooks/useArchive";
import { usePlayers } from "./playerComponents/hooks/usePlayers";
import { useFilters } from "./playerComponents/hooks/useFilters";
import { useEditing } from "./playerComponents/hooks/useEditing";
import { useAddPlayer } from "./playerComponents/hooks/useAddPlayer";
import { useColumnVisibility } from "./playerComponents/hooks/useColumnVisibility";
import { useContextMenu } from "./playerComponents/hooks/useContextMenu";
import { useMassShift } from "./playerComponents/hooks/useMassShift";
import { useIncrementAge } from "./playerComponents/hooks/useIncrementAge"; // новый импорт
import MassShiftModal from "./playerComponents/playerForArchiveMain/PlayerConsoleAdminArchiveComp";
import { TeamContextMenu } from "./playerComponents/components/TeamContextMenu";
import { GLeagueContextMenu } from "./playerComponents/components/GLeagueContextMenu";
import { FiltersPanel } from "./playerComponents/components/FiltersPanel";
import { MobileHeader } from "./playerComponents/components/MobileHeader";
import { DesktopHeader } from "./playerComponents/components/DesktopHeader";
import { PlayersTable } from "./playerComponents/components/PlayersTable";
import ColumnSelector from "./playerComponents/playerColumnSelectorMain/PlayerColumnSelectorMain";
import { Player } from "./playerComponents/types/Player";
import { supabase } from "../../../Supabase";
import "../playersRosterAgentControlCenter.css";

const PlayersRosterAgentControlCenter = () => {
  const isMobile = useMobile();
  const { archiveInitialized, initializeArchiveTable } = useArchive();
  const { players, setPlayers, addPlayer, updatePlayer } = usePlayers();
  const { filters, handleFilterChange, resetFilters, filteredPlayers } =
    useFilters(players);
  const {
    editingId,
    editData,
    startEdit,
    handleEditDataChange,
    saveEdit,
    cancelEdit,
  } = useEditing(updatePlayer, players, setPlayers);
  const {
    isAddingNew,
    newPlayer,
    startAdd,
    handleNewPlayerChange,
    addNewPlayer,
    cancelAdd,
  } = useAddPlayer(addPlayer);
  const {
    visibleColumns,
    visibleColumnsArray,
    visibleColumnsWithoutId,
    toggleColumn,
    selectAll,
    deselectAll,
    selectGroup,
    deselectGroup,
    columnGroups,
  } = useColumnVisibility();

  const teamMenu = useContextMenu();
  const gLeagueMenu = useContextMenu();

  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showMassShiftModal, setShowMassShiftModal] = useState(false);

  // Используем новый хук для повышения возраста
  const handleIncrementAge = useIncrementAge(players, updatePlayer, isMobile);

  // Хук для массового переноса
  const handleShiftClick = useMassShift(archiveInitialized, isMobile, () =>
    setShowMassShiftModal(true),
  );

  const handleTeamCellClick = (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => {
    teamMenu.openMenu(e, playerId, isNew);
  };

  const handleGLeagueCellClick = (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => {
    gLeagueMenu.openMenu(e, playerId, isNew);
  };

  const handleTeamSelect = (team: string) => {
    if (teamMenu.isNewPlayer) {
      handleNewPlayerChange("team", team);
    } else {
      handleEditDataChange("team", team);
    }
    teamMenu.closeMenu();
  };

  const handleGLeagueSelect = (g_league: string) => {
    if (gLeagueMenu.isNewPlayer) {
      handleNewPlayerChange("g_league", g_league);
    } else {
      handleEditDataChange("g_league", g_league);
    }
    gLeagueMenu.closeMenu();
  };

  const handleMassShiftSuccess = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    setShowMassShiftModal(false);
  };

  const handleMassShiftError = (error: Error) => {
    console.error("Mass shift error:", error);
    window.alert(
      isMobile
        ? "Ошибка при переносе данных!"
        : `❌ Произошла ошибка: ${error.message}`,
    );
  };

  return (
    <div className="playersRosterAgentControlCenter-container">
      <MassShiftModal
        isOpen={showMassShiftModal}
        onClose={() => setShowMassShiftModal(false)}
        players={players}
        supabase={supabase}
        archiveInitialized={archiveInitialized}
        isMobile={isMobile}
        showConfirm={window.confirm}
        showAlert={window.alert}
        onSuccess={handleMassShiftSuccess}
        onError={handleMassShiftError}
      />

      <TeamContextMenu
        show={teamMenu.show}
        x={teamMenu.x}
        y={teamMenu.y}
        searchQuery={teamMenu.searchQuery}
        onSearchChange={teamMenu.setSearchQuery}
        onSelect={handleTeamSelect}
        onClose={teamMenu.closeMenu}
        isMobile={isMobile}
      />

      <GLeagueContextMenu
        show={gLeagueMenu.show}
        x={gLeagueMenu.x}
        y={gLeagueMenu.y}
        searchQuery={gLeagueMenu.searchQuery}
        onSearchChange={gLeagueMenu.setSearchQuery}
        onSelect={handleGLeagueSelect}
        onClose={gLeagueMenu.closeMenu}
        isMobile={isMobile}
      />

      {isMobile ? (
        <MobileHeader
          showColumnSelector={showColumnSelector}
          onToggleColumnSelector={() =>
            setShowColumnSelector(!showColumnSelector)
          }
        />
      ) : (
        <DesktopHeader onAddClick={startAdd} />
      )}

      {(showColumnSelector || !isMobile) && (
        <ColumnSelector
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          columnGroups={columnGroups}
          onSelectGroup={selectGroup}
          onDeselectGroup={deselectGroup}
          isMobile={isMobile}
        />
      )}

      {isMobile && (
        <div className="playersRosterAgentControlCenter-mobile-view-controls">
          <button
            className="playersRosterAgentControlCenter-view-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="playersRosterAgentControlCenter-view-button playersRosterAgentControlCenter-successButton"
            onClick={startAdd}
          >
            + Add
          </button>
        </div>
      )}

      {(showFilters || !isMobile) && (
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          filteredCount={filteredPlayers.length}
          totalCount={players.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          isMobile={isMobile}
        />
      )}

      <PlayersTable
        players={filteredPlayers}
        visibleColumns={visibleColumnsArray}
        isAddingNew={isAddingNew}
        newPlayer={newPlayer}
        editingId={editingId}
        editData={editData}
        onEdit={startEdit}
        onSave={saveEdit}
        onCancel={cancelEdit}
        onAddNew={addNewPlayer}
        onCancelAdd={cancelAdd}
        onTeamCellClick={handleTeamCellClick}
        onGLeagueCellClick={handleGLeagueCellClick}
        onEditDataChange={handleEditDataChange}
        onNewPlayerChange={handleNewPlayerChange}
        isMobile={isMobile}
        onIncrementAge={handleIncrementAge}
      />
    </div>
  );
};

export default PlayersRosterAgentControlCenter;
