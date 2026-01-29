import React, { useRef } from "react";
import "./suns.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderSuns from "./header/HeaderSuns";
import InfoHeadSuns from "./body/info/InfoHeadSuns";
import RosterSuns from "./body/roster/RosterSuns";
import TradeListSuns from "./body/roster/TradeListSuns";
import RosterDeadCapSuns from "./body/roster/RosterDeadCapSuns";
import GLeagueRosterSuns from "./body/roster/GLeagueRosterSuns";
import RosterSunsFix from "./body/roster/RosterSunsFix";
import TradeResultSuns from "./tradeResult/TradeResulSuns";
import Trades from "../../events/trades/Trades";

const Suns = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="suns">
      <HeaderSuns
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
      <InfoHeadSuns />

      <div ref={rosterRef}>
        <RosterSunsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListSuns />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapSuns />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterSuns />
      </div> */}
      <Trades />
      <TradeResultSuns />
      <ScrollToTopButton />
    </div>
  );
};

export default Suns;
