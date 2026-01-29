import React, { useRef } from "react";
import "./warriors.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderWarriors from "./header/HeaderWarriors";
import InfoHeadWarriors from "./body/info/InfoHeadWarriors";
import RosterWarriors from "./body/roster/RosterWarriors";
import TradeListWarriors from "./body/roster/TradeListWarriors";
import RosterDeadCapWarriors from "./body/roster/RosterDeadCapWarriors";
import GLeagueRosterWarriors from "./body/roster/GLeagueRosterWarriors";
import RosterWarriorsFix from "./body/roster/RosterWarriorsFix";
import TradeResultWarriors from "./tradeResult/TradeResultWarriors";
import Trades from "../../events/trades/Trades";

const Warriors = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="warriors">
      <HeaderWarriors
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
      <InfoHeadWarriors />

      <div ref={rosterRef}>
        <RosterWarriorsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListWarriors />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapWarriors />
      </div>
      {/* <div ref={gLeagueRef}>{<GLeagueRosterWarriors />}</div> */}
      <Trades />
      <TradeResultWarriors />
      <ScrollToTopButton />
    </div>
  );
};

export default Warriors;
