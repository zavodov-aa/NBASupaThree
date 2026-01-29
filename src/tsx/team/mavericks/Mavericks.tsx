import React, { useRef } from "react";
import "./mavericks.css";
import HeaderMavericks from "./header/HeaderMavericks";
import InfoHeadMavericks from "./body/info/InfoHeadMavericks";
import RosterMavericks from "./body/roster/RosterMavericks";
import TradeListMavericks from "./body/roster/TradeListMavericks";
import RosterDeadCapMavericks from "./body/roster/RosterDeadCapMavericks";
import GLeagueRosterMavericks from "./body/roster/GLeagueRosterMavericks";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterMavericksFix from "./body/roster/RosterMavericksFix";
import TradeResultMavericks from "./tradeResult/TradeResultMavericks";
import Trades from "../../events/trades/Trades";

const Mavericks = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mavericks">
      <HeaderMavericks
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
      <InfoHeadMavericks />

      <div ref={rosterRef}>
        <RosterMavericksFix />
      </div>

      <div ref={tradesRef}>
        <TradeListMavericks />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapMavericks />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterMavericks />
      </div> */}
      <Trades />
      <TradeResultMavericks />
      <ScrollToTopButton />
    </div>
  );
};

export default Mavericks;
