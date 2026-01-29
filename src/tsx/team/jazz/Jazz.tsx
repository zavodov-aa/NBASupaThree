import React, { useRef } from "react";
import "./jazz.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderJazz from "./header/HeaderJazz";
import InfoHeadJazz from "./body/info/InfoHeadJazz";
import RosterJazz from "./body/roster/RosterJazz";
import TradeListJazz from "./body/roster/TradeListJazz";
import RosterDeadCapJazz from "./body/roster/RosterDeadCapJazz";
import GLeagueRosterJazz from "./body/roster/GLeagueRosterJazz";
import RosterJazzFix from "./body/roster/RosterJazzFix";
import TradeResultJazz from "./tradeResult/TradeResultJazz";
import Trades from "../../events/trades/Trades";

const Jazz = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="jazz">
      <HeaderJazz
        // onScrollToRoster={function (): void {
        //   throw new Error("Function not implemented.");
        // }}
        // onScrollToTrades={function (): void {
        //   throw new Error("Function not implemented.");
        // }}
        // onScrollToDeadCap={function (): void {
        //   throw new Error("Function not implemented.");
        // }}
        // onScrollToGLeague={function (): void {
        //   throw new Error("Function not implemented.");
        // }}
        onScrollToRoster={() => scrollToSection(rosterRef)}
        onScrollToTrades={() => scrollToSection(tradesRef)}
        onScrollToDeadCap={() => scrollToSection(deadCapRef)}
        // onScrollToGLeague={() => scrollToSection(gLeagueRef)}
      />
      <InfoHeadJazz />

      <div ref={rosterRef}>
        <RosterJazzFix />
      </div>

      <div ref={tradesRef}>
        <TradeListJazz />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapJazz />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterJazz />
      </div> */}
      <Trades />
      <TradeResultJazz />
      <ScrollToTopButton />
    </div>
  );
};

export default Jazz;
