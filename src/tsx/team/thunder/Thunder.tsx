import React, { useRef } from "react";
import "./thunder.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderThunder from "./header/HeaderThunder";
import InfoHeadThunder from "./body/info/InfoHeadThunder";
import RosterThunder from "./body/roster/RosterThunder";
import TradeListThunder from "./body/roster/TradeListThunder";
import RosterDeadCapThunder from "./body/roster/RosterDeadCapThunder";
import GLeagueRosterThunder from "./body/roster/GLeagueRosterThunder";
import RosterThunderFix from "./body/roster/RosterThunderFix";
import TradeResultThunder from "./tradeResult/TradeResultThunder";
import Trades from "../../events/trades/Trades";

const Thunder = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="thunder">
      <HeaderThunder
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
      <InfoHeadThunder />

      <div ref={rosterRef}>
        <RosterThunderFix />
      </div>

      <div ref={tradesRef}>
        <TradeListThunder />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapThunder />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterThunder />
      </div> */}
      <Trades />
      <TradeResultThunder />
      <ScrollToTopButton />
    </div>
  );
};

export default Thunder;
