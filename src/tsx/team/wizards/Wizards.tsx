import React, { useRef } from "react";
import "./wizards.css";

import ScrollToTopButton from "../scrollButton/ScrollToTopButton";
import HeaderWizards from "./header/HeaderWizards";
import InfoHeadWizards from "./body/info/InfoHeadWizards";
import RosterWizards from "./body/roster/RosterWizards";
import TradeListWizards from "./body/roster/TradeListWizards";
import RosterDeadCapWizards from "./body/roster/RosterDeadCapWizards";
import GLeagueRosterWizards from "./body/roster/GLeagueRosterWizards";
import RosterWizardsFix from "./body/roster/RosterWizardsFix";
import TradeResultWizards from "./tradeResult/TradeResultWizards";
import Trades from "../../events/trades/Trades";

const Wizards = () => {
  const rosterRef = useRef<HTMLDivElement>(null);
  const tradesRef = useRef<HTMLDivElement>(null);
  const deadCapRef = useRef<HTMLDivElement>(null);
  // const gLeagueRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="wizards">
      <HeaderWizards
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
      <InfoHeadWizards />

      <div ref={rosterRef}>
        <RosterWizardsFix />
      </div>

      <div ref={tradesRef}>
        <TradeListWizards />
      </div>
      <div ref={deadCapRef}>
        <RosterDeadCapWizards />
      </div>
      {/* <div ref={gLeagueRef}>
        <GLeagueRosterWizards />
      </div> */}
      <Trades />
      <TradeResultWizards />
      <ScrollToTopButton />
    </div>
  );
};

export default Wizards;
