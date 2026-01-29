import React, { useRef } from "react";
import "./lakers.css";
import HeaderLakers from "./header/HeaderLakers";
import InfoHeadLakers from "./body/Info/InfoHeadLakers";
import RosterLakers from "./body/roster/RosterLakers";
import TradeList from "./body/roster/TradeListLakers";
import RosterDeadCapLakers from "./body/roster/RosterDeadCapLakers";
import GLeagueRosterLakers from "./body/roster/GLeagueRosterLakers";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterLakersFix from "./body/roster/RosterLakersFix";
import TradeResultLakers from "./tradeResult/TradeResultLakers";
import Trades from "../../events/trades/Trades";

const Lakers = () => {
  // Создаем рефы для каждого раздела
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  // Функция для плавной прокрутки к разделу
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="lakers">
      {/* Передаем функцию прокрутки в Header */}
      <HeaderLakers
        onScrollToRoster={() => scrollToSection(rosterRef)}
        onScrollToTrades={() => scrollToSection(tradesRef)}
        onScrollToDeadCap={() => scrollToSection(deadCapRef)}
        // onScrollToGLeague={() => scrollToSection(gLeagueRef)}
      />

      <InfoHeadLakers />

      {/* Добавляем рефы к каждому разделу */}
      <div ref={rosterRef}>
        <RosterLakersFix />
      </div>

      <div ref={tradesRef}>
        <TradeList />
      </div>

      <div ref={deadCapRef}>
        <RosterDeadCapLakers />
      </div>

      {/* <div ref={gLeagueRef}>
        <GLeagueRosterLakers />
      </div> */}
      <Trades />
      <TradeResultLakers />
      <ScrollToTopButton />
    </div>
  );
};

export default Lakers;
