import React, { useRef } from "react";
import "./bulls.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderBulls from "./header/HeaderBulls";
import InfoHeadHawks from "../hawks/body/info/InfoHeadHawks";
import InfoHeadBulls from "./body/info/InfoHeadBulls";
import RosterBulls from "./body/roster/RosterBulls";
import TradeListBulls from "./body/roster/TradeListBulls";
import RosterDeadCapBulls from "./body/roster/RosterDeadCapBulls";
import GLeagueRosterBulls from "./body/roster/GLeagueRosterBulls";
import RosterBullsFix from "./body/roster/RosterBullsFix";
import TradeResultBulls from "./tradeResult/TradeResultBulls";
import Trades from "../../events/trades/Trades";

const Bulls = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bulls">
      <HeaderBulls
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
      <InfoHeadBulls />

      <div ref={rosterRef}>
        <RosterBullsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListBulls />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapBulls />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterBulls />
      </div> */}
      <Trades />
      <TradeResultBulls />
      <ScrollToTopButton />
    </div>
  );
};

export default Bulls;
