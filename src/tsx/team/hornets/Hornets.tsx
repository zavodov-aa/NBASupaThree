import React, { useRef } from "react";
import "./hornets.css";
import HeaderHornets from "./header/HeaderHornets";
import InfoHeadHornets from "./body/info/InfoHeadHornets";
import RosterHornets from "./body/roster/RosterHornets";
import TradeListHornets from "./body/roster/TradeListHornets";
import RosterDeadCapHornets from "./body/roster/RosterDeadCapHornets";
import GLeagueRosterHornets from "./body/roster/GLeagueRosterHornets";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterHornetsFix from "./body/roster/RosterHornetsFix";
import TradeResultHornets from "./tradeResult/TradeResultHornets";
import Trades from "../../events/trades/Trades";

const Hornets = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hawks">
      <HeaderHornets
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
      <InfoHeadHornets />

      <div ref={rosterRef}>
        <RosterHornetsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListHornets />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapHornets />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterHornets />
      </div> */}
      <Trades />
      <TradeResultHornets />
      <ScrollToTopButton />
    </div>
  );
};

export default Hornets;
