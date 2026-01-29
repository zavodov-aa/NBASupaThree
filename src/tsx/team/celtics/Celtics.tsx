import React, { useRef } from "react";
import "./celtics.css";
import HeaderCeltics from "./header/HeaderCeltics";
import InfoHeadCeltics from "./body/info/InfoHeadCeltics";
import RosterCeltics from "./body/roster/RosterCeltics";
import TradeListCeltics from "./body/roster/TradeListCeltics";
import RosterDeadCapCeltics from "./body/roster/RosterDeadCapCeltics";
import GLeagueRosterCeltics from "./body/roster/GLeagueRosterCeltics";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterCelticsFix from "./body/roster/RosterCelticsFix";
import TradeResultCeltics from "./tradeResult/TradeResultCeltics";
import Trades from "../../events/trades/Trades";

const Celtics = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="celtics">
      <HeaderCeltics
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
      <InfoHeadCeltics />
      <div ref={rosterRef}>
        <RosterCelticsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListCeltics />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapCeltics />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterCeltics />
      </div> */}
      <Trades />
      <TradeResultCeltics />
      <ScrollToTopButton />
    </div>
  );
};

export default Celtics;
