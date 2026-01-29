import React, { useRef } from "react";
import "./sevsix.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderSevsix from "./header/HeaderSevsix";
import InfoHeadSevsix from "./body/info/InfoHeadSevsix";
import RosterSevsix from "./body/roster/RosterSevsix";
import TradeListSevsix from "./body/roster/TradeListSevsix";
import RosterDeadCapSevsix from "./body/roster/RosterDeadCapSevsix";
import GLeagueRosterSevsix from "./body/roster/GLeagueRosterSevsix";
import RosterSevsixFix from "./body/roster/RosterSevsixFix";
import TradeResultSevSix from "./tradeResult/TradeResultSevsix";
import Trades from "../../events/trades/Trades";

const Sevsix = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sevsix">
      <HeaderSevsix
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
      <InfoHeadSevsix />

      <div ref={rosterRef}>
        <RosterSevsixFix />
      </div>

      <div ref={tradesRef}>
        <TradeListSevsix />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapSevsix />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterSevsix />
      </div> */}
      <Trades />
      <TradeResultSevSix />
      <ScrollToTopButton />
    </div>
  );
};

export default Sevsix;
