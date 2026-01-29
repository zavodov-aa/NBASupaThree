import React, { useRef } from "react";
import "./heat.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderHeat from "./Header/HeadetHeat";
import InfoHeadHeat from "./body/info/InfoHeadHeat";
import RosterHawks from "../hawks/body/roster/RosterHawks";
import TradeListHawks from "../hawks/body/roster/TradeListHawks";
import RosterDeadCapHawks from "../hawks/body/roster/RosterDeadCapHawks";
import GLeagueRosterHawks from "../hawks/body/roster/GLeagueRosterHawks";
import RosterHeat from "./body/roster/RosterHeat";
import TradeListHeat from "./body/roster/TradeListHeat";
import RosterDeadCapHeat from "./body/roster/RosterDeadCapHeat";
import GLeagueRosterHeat from "./body/roster/GLeagueRosterHeat";
import RosterHeatFix from "./body/roster/RosterHeatFix";
import TradeResultHeat from "./tradeResult/TradeResultHeat";
import Trades from "../../events/trades/Trades";

const Heat = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="heat">
      <HeaderHeat
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
      <InfoHeadHeat />

      <div ref={rosterRef}>
        <RosterHeatFix />
      </div>

      <div ref={tradesRef}>
        <TradeListHeat />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapHeat />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterHeat />
      </div> */}
      <Trades />
      <TradeResultHeat />
      <ScrollToTopButton />
    </div>
  );
};

export default Heat;
