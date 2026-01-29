import React, { useRef } from "react";
import "./rockets.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderRockets from "./header/HeaderRockets";
import InfoHeadRockets from "./body/info/InfoHeadRockets";
import RosterRockets from "./body/roster/RosterRockets";
import TradeListRockets from "./body/roster/TradeListRockets";
import RosterDeadCapRockets from "./body/roster/RosterDeadCapRockets";
import GLeagueRosterHawks from "./body/roster/GLeagueRosterRockets";
import RosterRocketsFix from "./body/roster/RosterRocketsFix";
import TradeResultRockets from "./tradeResult/TradeResultRockets";
import Trades from "../../events/trades/Trades";

const Rockets = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hawks">
      <HeaderRockets
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
      <InfoHeadRockets />

      <div ref={rosterRef}>
        <RosterRocketsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListRockets />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapRockets />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterHawks />
      </div> */}
      <Trades />
      <TradeResultRockets />
      <ScrollToTopButton />
    </div>
  );
};

export default Rockets;
