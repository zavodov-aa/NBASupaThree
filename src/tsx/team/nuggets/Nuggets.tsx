import React, { useRef } from "react";
import "./nuggets.css";
import HeaderNuggets from "./header/HeaderNuggets";
import InfoHeadNuggets from "./body/info/InfoHeadNuggets";
import RosterNuggets from "./body/roster/RosterNuggets";
import TradeListNuggets from "./body/roster/TradeListNuggets";
import RosterDeadCapNuggets from "./body/roster/RosterDeadCapNuggets";
import GLeagueRosterNuggets from "./body/roster/GLeagueRosterNuggets";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterNuggetsFix from "./body/roster/RosterNuggetsFix";
import TradeResultNuggets from "./tradeResult/TradeResultNuggets";
import Trades from "../../events/trades/Trades";

const Nuggets = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="nuggets">
      <HeaderNuggets
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
      <InfoHeadNuggets />

      <div ref={rosterRef}>
        <RosterNuggetsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListNuggets />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapNuggets />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterNuggets />
      </div> */}
      <Trades />
      <TradeResultNuggets />
      <ScrollToTopButton />
    </div>
  );
};

export default Nuggets;
