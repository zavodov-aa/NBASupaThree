import React, { useRef } from "react";
import "./cavaliers.css";
import HeaderCavaliers from "./header/HeaderCavaliers";
import InfoHeadCavaliers from "./body/info/InfoHeadCavaliers";
import RosterCavaliers from "./body/roster/RosterCavaliers";
import TradeListCavaliers from "./body/roster/TradeListCavaliers";
import RosterDeadCapCavaliers from "./body/roster/RosterDeadCapCavaliers";
import GLeagueRosterCavaliers from "./body/roster/GLeagueRosterCavaliers";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import RosterCavaliersFix from "./body/roster/RosterCavaliersFix";
import TradeResultCavaliers from "./tradeResult/TradeResultCavaliers";
import Trades from "../../events/trades/Trades";

const Cavaliers = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="cavaliers">
      <HeaderCavaliers
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
      <InfoHeadCavaliers />

      <div ref={rosterRef}>
        <RosterCavaliersFix />
      </div>

      <div ref={tradesRef}>
        <TradeListCavaliers />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapCavaliers />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterCavaliers />
      </div> */}
      <Trades />
      <TradeResultCavaliers />
      <ScrollToTopButton />
    </div>
  );
};

export default Cavaliers;
