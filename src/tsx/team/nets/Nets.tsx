import React, { useRef } from "react";
import "./nets.css";
import HeaderNets from "./header/HeaderNets";
import InfoHeadNets from "./body/info/InfoHeadNets";
import RosterNets from "./body/roster/RosterNets";
import TradeListNets from "./body/roster/TradeListNets";
import RosterDeadCapNets from "./body/roster/RosterDeadCapNets";
import GLeagueRosterNets from "./body/roster/GLeagueRosterNets";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterNetsFix from "./body/roster/RosterNetsFix";
import Trades from "../../events/trades/Trades";
import TradeResultNets from "./tradeResult/TradeResultNets";

const Nets = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="nets">
      <HeaderNets
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
      <InfoHeadNets />
      <div ref={rosterRef}>
        <RosterNetsFix />
      </div>
      <div ref={tradesRef}>
        <TradeListNets />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapNets />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterNets />
      </div> */}
      <Trades />
      <TradeResultNets />
      <ScrollToTopButton />
    </div>
  );
};

export default Nets;
