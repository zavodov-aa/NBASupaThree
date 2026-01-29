import React, { useRef } from "react";
import "./spurs.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderSpurs from "./header/HeaderSpurs";
import InfoHeadSpurs from "./body/info/InfoHeadSpurs";
import RosterSpurs from "./body/roster/RosterSpurs";
import TradeListSpurs from "./body/roster/TradeListSpurs";
import RosterDeadCapSpurs from "./body/roster/RosterDeadCapSpurs";
import GLeagueRosterSpurs from "./body/roster/GLeagueRosterSpurs";
import RosterSpursFix from "./body/roster/RosterSpursFix";
import TradeResultSpurs from "./tradeResult/TradeResultSpurs";
import Trades from "../../events/trades/Trades";

const Spurs = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="spurs">
      <HeaderSpurs
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
      <InfoHeadSpurs />

      <div ref={rosterRef}>
        <RosterSpursFix />
      </div>

      <div ref={tradesRef}>
        <TradeListSpurs />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapSpurs />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterSpurs />
      </div> */}
      <Trades />
      <TradeResultSpurs />
      <ScrollToTopButton />
    </div>
  );
};

export default Spurs;
