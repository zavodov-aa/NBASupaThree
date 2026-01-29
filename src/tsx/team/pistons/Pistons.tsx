import React, { useRef } from "react";
import "./pistons.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderPistons from "./header/HeaderPistons";
import InfoHeadPistons from "./body/info/InfoHeadPistons";
import RosterPistons from "./body/roster/RosterPistons";
import TradeListPistons from "./body/roster/TradeListPistons";
import RosterDeadCapHawks from "../hawks/body/roster/RosterDeadCapHawks";
import RosterDeadCapPistons from "./body/roster/RosterDeadCapPistons";
import GLeagueRosterPistons from "./body/roster/GLeagueRosterPistons";
import RosterPistonsFix from "./body/roster/RosterPistonsFix";
import TradeResultPistons from "./tradeResult/TradeResultPistons";
import Trades from "../../events/trades/Trades";

const Hawks = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hawks">
      <HeaderPistons
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
      <InfoHeadPistons />

      <div ref={rosterRef}>
        <RosterPistonsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListPistons />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapPistons />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterPistons />
      </div> */}
      <Trades />
      <TradeResultPistons />
      <ScrollToTopButton />
    </div>
  );
};

export default Hawks;
