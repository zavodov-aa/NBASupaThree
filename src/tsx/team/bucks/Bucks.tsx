import React, { useRef } from "react";
import "./bucks.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderBucks from "./header/HeaderBucks";
import InfoHeadBucks from "./body/info/InfoHeadBucks";
import RosterBucks from "./body/roster/RosterBucks";
import TradeListBucks from "./body/roster/TradeListBucks";
import RosterDeadCapBucks from "./body/roster/RosterDeadCapBucks";
import GLeagueRosterBucks from "./body/roster/GLeagueRosterBucks";
import RosterBucksFix from "./body/roster/RosterBucksFix";
import TradeResultBucks from "./tradeResult/TradeResultBucks";
import Trades from "../../events/trades/Trades";

const Bucks = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bucks">
      <HeaderBucks
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
      <InfoHeadBucks />

      <div ref={rosterRef}>
        <RosterBucksFix />
      </div>

      <div ref={tradesRef}>
        <TradeListBucks />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapBucks />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterBucks />
      </div> */}
      <Trades />
      <TradeResultBucks />
      <ScrollToTopButton />
    </div>
  );
};

export default Bucks;
