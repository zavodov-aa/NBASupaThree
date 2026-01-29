import React, { useRef } from "react";
import "./hawks.css";
import HeaderHawks from "./header/HeaderHawks";
import InfoHeadHawks from "./body/info/InfoHeadHawks";
import RosterHawks from "./body/roster/RosterHawks";
import TradeListHawks from "./body/roster/TradeListHawks";
import RosterDeadCapHawks from "./body/roster/RosterDeadCapHawks";
import GLeagueRosterHawks from "./body/roster/GLeagueRosterHawks";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterHawksFix from "./body/roster/RosterHawksFix";
import Trades from "../../events/trades/Trades";
import TradeResultHawks from "./body/tradeResult/TradeResultHawks";

const Hawks = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hawks">
      <HeaderHawks
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
      <InfoHeadHawks />

      <div ref={rosterRef}>
        {/* <RosterHawks /> */}
        <RosterHawksFix />
      </div>

      <div ref={tradesRef}>
        <TradeListHawks />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapHawks />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterHawks />
      </div> */}
      <Trades />
      <TradeResultHawks />
      <ScrollToTopButton />
    </div>
  );
};

export default Hawks;
