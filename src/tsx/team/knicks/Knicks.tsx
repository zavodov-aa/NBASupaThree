import React, { useRef } from "react";
import "./knicks.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderKnicks from "./header/HeaderKnicks";
import InfoHeadKnicks from "./body/info/InfoHeadKnicks";
import RosterKnicks from "./body/roster/RosterKnicks";
import TradeListKnicks from "./body/roster/TradeListKnicks";
import RosterDeadCapKnicks from "./body/roster/RosterDeadCapKnicks";
import GLeagueRosterKnicks from "./body/roster/GLeagueRosterKnicks";
import RosterKnicksFix from "./body/roster/RosterKnicksFix";
import TradeResultKnicks from "./tradeResult/TradeResultKnicks";
import Trades from "../../events/trades/Trades";

const Knicks = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="knicks">
      <HeaderKnicks
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
      <InfoHeadKnicks />

      <div ref={rosterRef}>
        <RosterKnicksFix />
      </div>

      <div ref={tradesRef}>
        <TradeListKnicks />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapKnicks />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterKnicks />
      </div> */}
      <Trades />
      <TradeResultKnicks />
      <ScrollToTopButton />
    </div>
  );
};

export default Knicks;
