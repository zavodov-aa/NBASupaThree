import React, { useRef } from "react";
import "./clippers.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderClippers from "./header/HeaderClippers";
import InfoHeadClippers from "./body/info/InfoHeadClippers";
import RosterClippers from "./body/roster/RosterClippers";
import TradeListClippers from "./body/roster/TradeListClippers";
import GLeagueRosterClippers from "./body/roster/GLeagueRosterClippers";
import RosterDeadCapClippers from "./body/roster/RosterDeadCapClippers";
import RosterClippersFix from "./body/roster/RosterClippersFix";
import TradeResultClippers from "./tradeResult/TradeResultClippers";
import Trades from "../../events/trades/Trades";

const Clippers = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="clippers">
      <HeaderClippers
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
      <InfoHeadClippers />

      <div ref={rosterRef}>
        <RosterClippersFix />
      </div>

      <div ref={tradesRef}>
        <TradeListClippers />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapClippers />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterClippers />
      </div> */}
      <Trades />
      <TradeResultClippers />
      <ScrollToTopButton />
    </div>
  );
};

export default Clippers;
