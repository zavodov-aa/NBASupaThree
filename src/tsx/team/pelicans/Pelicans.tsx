import React, { useRef } from "react";
import "./pelicans.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderPelicans from "./header/HeaderPelicans";
import InfoHeadPelicans from "./body/info/InfoHeadPelicans";
import RosterPelicans from "./body/roster/RosterPelicans";
import TradeListPelicans from "./body/roster/TradeListPelicans";
import RosterDeadCapPelicans from "./body/roster/RosterDeadCapPelicans";
import GLeagueRosterPelicans from "./body/roster/GLeagueRosterPelicans";
import RosterPelicansFix from "./body/roster/RosterPelicansFix";
import TradeResultPelicans from "./tradeResult/TradeResultPelicans";
import Trades from "../../events/trades/Trades";

const Pelicans = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pelicans">
      <HeaderPelicans
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
      <InfoHeadPelicans />

      <div ref={rosterRef}>
        <RosterPelicansFix />
      </div>

      <div ref={tradesRef}>
        <TradeListPelicans />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapPelicans />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterPelicans />
      </div> */}
      <Trades />
      <TradeResultPelicans />
      <ScrollToTopButton />
    </div>
  );
};

export default Pelicans;
