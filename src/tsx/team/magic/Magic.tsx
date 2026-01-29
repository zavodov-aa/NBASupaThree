import React, { useRef } from "react";
import "./magic.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderMagic from "./header/HeaderMagic";
import InfoHeadMagic from "./body/info/InfoHeadMagic";
import RosterMagic from "./body/roster/RosterMagic";
import TradeListMagic from "./body/roster/TradeListMagic";
import RosterDeadCapMagic from "./body/roster/RosterDeadCapMagic";
import GLeagueRosterMagic from "./body/roster/GLeagueRosterMagic";
import RosterMagicFix from "./body/roster/RosterMagicFix";
import TradeResultMagic from "./tradeResult/TradeResultMagic";
import Trades from "../../events/trades/Trades";

const Magic = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="magic">
      <HeaderMagic
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
      <InfoHeadMagic />

      <div ref={rosterRef}>
        <RosterMagicFix />
      </div>

      <div ref={tradesRef}>
        <TradeListMagic />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapMagic />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterMagic />
      </div> */}
      <Trades />
      <TradeResultMagic />
      <ScrollToTopButton />
    </div>
  );
};

export default Magic;
