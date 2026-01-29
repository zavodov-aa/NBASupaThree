import React, { useRef } from "react";
import "./timberwolves.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderTimberwolves from "./header/HeaderTimberwolves";
import InfoHeadTimberwolves from "./body/info/InfoHeadTimberwolves";
import RosterTimberwolves from "./body/roster/RosterTimberwolves";
import TradeListTimberwolves from "./body/roster/TradeListTimberwolves";
import RosterDeadCapTimberwolves from "./body/roster/RosterDeadCapTimberwolves";
import GLeagueRosterTimberwolves from "./body/roster/GLeagueRosterTimberwolves";
import RosterTimberwolvesFix from "./body/roster/RosterTimberwolvesFix";
import TradeResultTimberwolves from "./tradeResult/TradeResultTimberwolves";
import Trades from "../../events/trades/Trades";

const Timberwolves = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="timberwolves">
      <HeaderTimberwolves
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
      <InfoHeadTimberwolves />

      <div ref={rosterRef}>
        <RosterTimberwolvesFix />
      </div>

      <div ref={tradesRef}>
        <TradeListTimberwolves />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapTimberwolves />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterTimberwolves />
      </div> */}
      <Trades />
      <TradeResultTimberwolves />
      <ScrollToTopButton />
    </div>
  );
};

export default Timberwolves;
