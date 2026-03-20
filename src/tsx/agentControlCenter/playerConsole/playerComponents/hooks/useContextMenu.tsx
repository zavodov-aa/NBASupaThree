import { useState, useCallback } from "react";

export type ContextMenuState = {
  show: boolean;
  x: number;
  y: number;
  playerId: number | null;
  isNewPlayer: boolean;
};

export const useContextMenu = () => {
  const [menuState, setMenuState] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    playerId: null,
    isNewPlayer: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const openMenu = useCallback(
    (e: React.MouseEvent, playerId: number | null, isNewPlayer: boolean) => {
      e.preventDefault();
      setMenuState({
        show: true,
        x: e.clientX,
        y: e.clientY,
        playerId,
        isNewPlayer,
      });
      setSearchQuery("");
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setMenuState({
      show: false,
      x: 0,
      y: 0,
      playerId: null,
      isNewPlayer: false,
    });
    setSearchQuery("");
  }, []);

  const selectItem = useCallback(
    (value: string, onSelect: (value: string) => void) => {
      onSelect(value);
      closeMenu();
    },
    [closeMenu],
  );

  return {
    ...menuState,
    searchQuery,
    setSearchQuery,
    openMenu,
    closeMenu,
    selectItem,
  };
};
