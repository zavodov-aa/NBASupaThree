import React, { useRef } from "react";
import "./grizzlies.css";
import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderGrizzlies from "./header/HeaderGrizzlies";
import InfoHeadGrizzlies from "./body/info/InfoHeadGrizzlies";
import RosterGrizzlies from "./body/roster/RosterGrizzlies";
import TradeListGrizzlies from "./body/roster/TradeListGrizzlies";
import RosterDeadCapGrizzlies from "./body/roster/RosterDeadCapGrizzlies";
import GLeagueRosterGrizzlies from "./body/roster/GLeagueRosterGrizzlies";
import RosterGrizzliesFix from "./body/roster/RosterGrizzliesFix";
import TradeResultGrizzlies from "./tradeResult/TradeResultGrizzlies";
import Trades from "../../events/trades/Trades";

const Grizzlies = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="grizzlies">
      <HeaderGrizzlies
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
      <InfoHeadGrizzlies />

      <div ref={rosterRef}>
        <RosterGrizzliesFix />
      </div>

      <div ref={tradesRef}>
        <TradeListGrizzlies />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapGrizzlies />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterGrizzlies />
      </div> */}
      <Trades />
      <TradeResultGrizzlies />
      <ScrollToTopButton />
    </div>
  );
};

export default Grizzlies;
