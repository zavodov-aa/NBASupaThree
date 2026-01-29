import React, { useRef } from "react";
import "./raptors.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderRaptors from "./header/HeaderRaptors";
import InfoHeadRaptors from "./body/info/InfoHeadRaptors";
import RosterRaptors from "./body/roster/RosterRaptors";
import TradeListRaptors from "./body/roster/TradeListRaptors";
import RosterDeadCapRaptors from "./body/roster/RosterDeadCapRaptors";
import GLeagueRosterRaptors from "./body/roster/GLeagueRosterRaptors";
import RosterRaptorsFix from "./body/roster/RosterRaptorsFix";
import TradeResultRaptors from "./tradeResult/TradeResultRaptors";
import Trades from "../../events/trades/Trades";

const Raptors = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="raptors">
      <HeaderRaptors
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
      <InfoHeadRaptors />

      <div ref={rosterRef}>
        <RosterRaptorsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListRaptors />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapRaptors />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterRaptors />
      </div> */}
      <Trades />
      <TradeResultRaptors />
      <ScrollToTopButton />
    </div>
  );
};

export default Raptors;
