import React, { useRef } from "react";
import "./kings.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderKings from "./header/HeaderKings";
import InfoHeadKings from "./body/info/InfoHeadKings";
import RosterHawks from "../hawks/body/roster/RosterHawks";
import TradeListHawks from "../hawks/body/roster/TradeListHawks";
import RosterDeadCapHawks from "../hawks/body/roster/RosterDeadCapHawks";
import GLeagueRosterHawks from "../hawks/body/roster/GLeagueRosterHawks";
import RosterKings from "./body/roster/RosterKings";
import TradeListKings from "./body/roster/TradeListKings";
import RosterDeadCapKings from "./body/roster/RosterDeadCapKings";
import GLeagueRosterKings from "./body/roster/GLeagueRosterKings";
import RosterKingsFix from "./body/roster/RosterKingsFix";
import TradeResultKings from "./tradeResult/TradeResultKings";
import Trades from "../../events/trades/Trades";

const Kings = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="kings">
      <HeaderKings
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
      <InfoHeadKings />

      <div ref={rosterRef}>
        <RosterKingsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListKings />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapKings />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterKings />
      </div> */}
      <Trades />
      <TradeResultKings />
      <ScrollToTopButton />
    </div>
  );
};

export default Kings;
