// import React from "react";
// import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
// import PlayerConsoleAdminBody from "./PlayerConsoleAdminBody";
// import PicksBody from "../picks/picksBody/PicksBody";
// import CashBody from "../picks/cashBody/CashBody";

// import { useRole } from "../../authorization/useRole";
// import "../playersRosterAgentControlCenter.css";

// const PlayerConsoleAdminMain = () => {
//   const { isAdmin } = useRole();
//   const readOnly = !isAdmin;

//   return (
//     <>
//       <PlayerOptionHeader />
//       <PlayerConsoleAdminBody />

//       <div className="fixed-picks-button">
//         <PicksBody readOnly={readOnly} />
//         <CashBody readOnly={readOnly} />
//       </div>
//     </>
//   );
// };

// export default PlayerConsoleAdminMain;

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import PlayerOptionHeader from "../../market/playerOption/playerOptionAdmin/PlayerOptionHeader";
import PlayerConsoleAdminBody from "./PlayerConsoleAdminBody";
import PicksBody from "../picks/picksBody/PicksBody";
import CashBody from "../picks/cashBody/CashBody";

import { useRole } from "../../authorization/useRole";
import "../playersRosterAgentControlCenter.css";
import "./dragButton.css";

const FAB_SIZE = 56;
const PANEL_MARGIN = 12;
const GAP = 10; // отступ между кнопкой и панелью
const STORAGE_KEY = "pcam-fab-pos";

interface Position {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const PlayerConsoleAdminMain = () => {
  const { isAdmin } = useRole();
  const readOnly = !isAdmin;

  const [open, setOpen] = useState(false);

  const [pos, setPos] = useState<Position>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Position>;
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          return {
            x: clamp(
              parsed.x,
              PANEL_MARGIN,
              window.innerWidth - FAB_SIZE - PANEL_MARGIN,
            ),
            y: clamp(
              parsed.y,
              PANEL_MARGIN,
              window.innerHeight - FAB_SIZE - PANEL_MARGIN,
            ),
          };
        }
      }
    } catch {
      /* noop */
    }
    return {
      x: window.innerWidth - FAB_SIZE - 20,
      y: window.innerHeight - FAB_SIZE - 20,
    };
  });

  // Позиция панели — вычисляем после рендера, зная её реальные размеры
  const [panelPos, setPanelPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const dragging = useRef(false);
  const moved = useRef(false);
  const offset = useRef<Position>({ x: 0, y: 0 });

  // === Drag кнопки ===
  const onFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragging.current = true;
    moved.current = false;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    const nx = e.clientX - offset.current.x;
    const ny = e.clientY - offset.current.y;

    if (Math.abs(nx - pos.x) > 2 || Math.abs(ny - pos.y) > 2) {
      moved.current = true;
    }

    setPos({
      x: clamp(nx, PANEL_MARGIN, window.innerWidth - FAB_SIZE - PANEL_MARGIN),
      y: clamp(ny, PANEL_MARGIN, window.innerHeight - FAB_SIZE - PANEL_MARGIN),
    });
  };

  const onFabPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }

    if (!moved.current) {
      setOpen((v) => !v);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
      } catch {
        /* noop */
      }
    }
  };

  // Подгоняем позицию кнопки при resize
  useEffect(() => {
    const onResize = () => {
      setPos((p) => ({
        x: clamp(
          p.x,
          PANEL_MARGIN,
          window.innerWidth - FAB_SIZE - PANEL_MARGIN,
        ),
        y: clamp(
          p.y,
          PANEL_MARGIN,
          window.innerHeight - FAB_SIZE - PANEL_MARGIN,
        ),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Escape для закрытия
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /**
   * Пересчитывает позицию панели относительно кнопки,
   * используя её ФАКТИЧЕСКИЕ размеры (после рендера).
   * Выбирает лучшее положение: справа → слева → сверху → снизу.
   * Панель всегда рядом с кнопкой, не улетает к краю экрана.
   */
  const recalcPanelPosition = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const panelW = rect.width;
    const panelH = rect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const fabRight = pos.x + FAB_SIZE;
    const fabBottom = pos.y + FAB_SIZE;

    // Пробуем разместить панель справа от кнопки
    let left: number;
    if (fabRight + GAP + panelW + PANEL_MARGIN <= vw) {
      left = fabRight + GAP;
    } else if (pos.x - GAP - panelW >= PANEL_MARGIN) {
      // иначе слева
      left = pos.x - GAP - panelW;
    } else {
      // не влезает по бокам — прижимаем к ближайшему краю
      left = clamp(fabRight - panelW, PANEL_MARGIN, vw - panelW - PANEL_MARGIN);
    }

    // По вертикали: стараемся выровнять верх панели с верхом кнопки
    let top = pos.y;
    if (top + panelH + PANEL_MARGIN > vh) {
      top = vh - panelH - PANEL_MARGIN;
    }
    top = clamp(
      top,
      PANEL_MARGIN,
      Math.max(PANEL_MARGIN, vh - panelH - PANEL_MARGIN),
    );

    setPanelPos({ left, top });
  }, [pos.x, pos.y]);

  // После открытия панели измеряем её и позиционируем
  useLayoutEffect(() => {
    if (!open) {
      setPanelPos(null);
      return;
    }
    recalcPanelPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pos.x, pos.y]);

  // Если содержимое панели подгрузилось и высота изменилась — пересчитаем
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const el = panelRef.current;
    const ro = new ResizeObserver(() => recalcPanelPosition());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, recalcPanelPosition]);

  // Пересчёт при ресайзе окна
  useEffect(() => {
    if (!open) return;
    const onResize = () => recalcPanelPosition();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, recalcPanelPosition]);

  return (
    <>
      <PlayerOptionHeader />
      <PlayerConsoleAdminBody />

      <button
        type="button"
        className={`pcam-fab ${open ? "pcam-fab--open" : ""}`}
        style={{ left: pos.x, top: pos.y }}
        onPointerDown={onFabPointerDown}
        onPointerMove={onFabPointerMove}
        onPointerUp={onFabPointerUp}
        onPointerCancel={onFabPointerUp}
        title={
          open ? "Скрыть панель Picks / Cash" : "Открыть панель Picks / Cash"
        }
        aria-label={open ? "Скрыть панель" : "Открыть панель Picks и Cash"}
        aria-expanded={open}
      >
        <span className="pcam-fab__icon">{open ? "✕" : "1st💰"}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="pcam-panel"
          style={{
            left: panelPos?.left ?? -9999, // до первого измерения — прячем за экран
            top: panelPos?.top ?? -9999,
            // visibility вместо display, чтобы можно было измерить размеры
            visibility: panelPos ? "visible" : "hidden",
          }}
        >
          <div className="pcam-panel__header">
            <span className="pcam-panel__title">Picks / Cash</span>
            <button
              type="button"
              className="pcam-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть панель"
              title="Закрыть"
            >
              ✕
            </button>
          </div>

          <div className="pcam-panel__content">
            <PicksBody readOnly={readOnly} />
            <CashBody readOnly={readOnly} />
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerConsoleAdminMain;
