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
import { useIncrementAge } from "./playerComponents/hooks/useIncrementAge";
import { useIncrementExp } from "./playerComponents/hooks/useIncrementExp";
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
import { useMassShiftDC } from "./playerComponents/hooks/useMassShiftDC";
import MassShiftDCModal from "./playerComponents/playerForArchiveMain/PlayerConsoleAdminArchiveCompDC";

// 👈 ДОБАВЛЕНО: импорт хука роли
import { useRole } from "../../authorization/useRole";

const PlayersRosterAgentControlCenter = () => {
  // 👈 ДОБАВЛЕНО: определяем роль и readOnly
  const { isAdmin } = useRole();
  const readOnly = !isAdmin;

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
  const deadCapTeamMenu = useContextMenu();

  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showMassShiftModal, setShowMassShiftModal] = useState(false);
  const [showMassShiftDCModal, setShowMassShiftDCModal] = useState(false);

  // Используем новый хук для повышения возраста
  const handleIncrementAge = useIncrementAge(players, updatePlayer, isMobile);
  // Используем новый хук для повышения EXP
  const handleIncrementExp = useIncrementExp(players, updatePlayer, isMobile);

  // Хук для массового переноса
  const handleShiftClick = useMassShift(archiveInitialized, isMobile, () =>
    setShowMassShiftModal(true),
  );
  const handleShiftDCClick = useMassShiftDC(archiveInitialized, isMobile, () =>
    setShowMassShiftDCModal(true),
  );

  const handleTeamCellClick = (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => {
    // 👈 ДОБАВЛЕНО: защита от вызова у не-админа
    if (readOnly) return;
    teamMenu.openMenu(e, playerId, isNew);
  };

  const handleGLeagueCellClick = (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => {
    // 👈 ДОБАВЛЕНО: защита от вызова у не-админа
    if (readOnly) return;
    gLeagueMenu.openMenu(e, playerId, isNew);
  };

  const handleDeadCapTeamCellClick = (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => {
    // 👈 ДОБАВЛЕНО: защита от вызова у не-админа
    if (readOnly) return;
    deadCapTeamMenu.openMenu(e, playerId, isNew);
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

  const handleDeadCapTeamSelect = (team: string) => {
    if (deadCapTeamMenu.isNewPlayer) {
      handleNewPlayerChange("dead_cap_team", team);
    } else {
      handleEditDataChange("dead_cap_team", team);
    }
    deadCapTeamMenu.closeMenu();
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
      {/* 👈 ИЗМЕНЕНО: модалки массового переноса — только для админа */}
      {isAdmin && (
        <>
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
          <MassShiftDCModal
            isOpen={showMassShiftDCModal}
            onClose={() => setShowMassShiftDCModal(false)}
            players={players}
            supabase={supabase}
            archiveInitialized={archiveInitialized}
            isMobile={isMobile}
            showConfirm={window.confirm}
            showAlert={window.alert}
            onSuccess={(updatedPlayers: Player[]) => {
              setPlayers(updatedPlayers);
              setShowMassShiftDCModal(false);
            }}
            onError={(error: Error) => {
              console.error("Mass shift DC error:", error);
              window.alert(
                isMobile
                  ? "Ошибка при переносе DC данных!"
                  : `❌ Произошла ошибка: ${error.message}`,
              );
            }}
          />
        </>
      )}

      {/* 👈 ИЗМЕНЕНО: контекстные меню — только для админа */}
      {isAdmin && (
        <>
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

          <GLeagueContextMenu
            show={deadCapTeamMenu.show}
            x={deadCapTeamMenu.x}
            y={deadCapTeamMenu.y}
            searchQuery={deadCapTeamMenu.searchQuery}
            onSearchChange={deadCapTeamMenu.setSearchQuery}
            onSelect={handleDeadCapTeamSelect}
            onClose={deadCapTeamMenu.closeMenu}
            isMobile={isMobile}
          />
        </>
      )}

      {/* 👈 ИЗМЕНЕНО: прокидываем readOnly в хедеры */}
      {isMobile ? (
        <MobileHeader
          readOnly={readOnly}
          showColumnSelector={showColumnSelector}
          onToggleColumnSelector={() =>
            setShowColumnSelector(!showColumnSelector)
          }
        />
      ) : (
        <DesktopHeader onAddClick={startAdd} readOnly={readOnly} />
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
          {/* 👈 ИЗМЕНЕНО: кнопка Add — только для админа */}
          {!readOnly && (
            <button
              className="playersRosterAgentControlCenter-view-button playersRosterAgentControlCenter-successButton"
              onClick={startAdd}
            >
              + Add
            </button>
          )}
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

      {/* 👈 ИЗМЕНЕНО: прокидываем readOnly и админские колбэки */}
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
        onDeadCapTeamCellClick={handleDeadCapTeamCellClick}
        onEditDataChange={handleEditDataChange}
        onNewPlayerChange={handleNewPlayerChange}
        isMobile={isMobile}
        onIncrementAge={isAdmin ? handleIncrementAge : undefined}
        onIncrementExp={isAdmin ? handleIncrementExp : undefined}
        onShiftDC={isAdmin ? handleShiftDCClick : undefined}
        readOnly={readOnly}
      />
    </div>
  );
};

export default PlayersRosterAgentControlCenter;
