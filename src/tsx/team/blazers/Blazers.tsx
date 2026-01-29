import React, { useRef } from "react";
import "./blazers.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderBlazers from "./header/HeaderBlazers";
import InfoHeadBlazers from "./body/info/InfoHeadBlazers";
import RosterBlazers from "./body/roster/RosterBlazers";
import TradeListBlazers from "./body/roster/TradeListBlazers";
import RosterDeadCapBlazers from "./body/roster/RosterDeadCapBlazers";
import GLeagueRosterBlazers from "./body/roster/GLeagueRosterBlazers";
import RosterBlazersFix from "./body/roster/RosterBlazersFix";
import TradeResultBlazers from "./tradeResult/TradeResultBlazers";
import Trades from "../../events/trades/Trades";

const Blazers = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="blazers">
      <HeaderBlazers
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
      <InfoHeadBlazers />

      <div ref={rosterRef}>
        <RosterBlazersFix />
      </div>

      <div ref={tradesRef}>
        <TradeListBlazers />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapBlazers />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterBlazers />
      </div> */}
      <Trades />
      <TradeResultBlazers />
      <ScrollToTopButton />
    </div>
  );
};

export default Blazers;
