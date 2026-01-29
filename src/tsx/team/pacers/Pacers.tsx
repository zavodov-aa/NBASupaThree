import React, { useRef } from "react";
import "./pacers.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderPacers from "./header/HeaderPacers";
import InfoHeadPacers from "./body/info/InfoHeadPacers";
import RosterPacers from "./body/roster/RosterPacers";
import TradeListPacers from "./body/roster/TradeListPacers";
import RosterDeadCapPacers from "./body/roster/RosterDeadCapPacers";
import GLeagueRosterPacers from "./body/roster/GLeagueRosterPacers";
import RosterPacersFix from "./body/roster/RosterPacersFix";
import TradeResultPacers from "./tradeResult/TradeResultPacers";
import Trades from "../../events/trades/Trades";

const Pacers = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pacers">
      <HeaderPacers
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
      <InfoHeadPacers />

      <div ref={rosterRef}>
        <RosterPacersFix />
      </div>

      <div ref={tradesRef}>
        <TradeListPacers />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapPacers />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterPacers />
      </div> */}
      <Trades />
      <TradeResultPacers />
      <ScrollToTopButton />
    </div>
  );
};

export default Pacers;
