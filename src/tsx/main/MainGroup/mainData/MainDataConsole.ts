// data/console.ts
import { ConsoleItem } from "../MainTypes";

export const consoleCom: ConsoleItem[] = [
  { id: "head", name: "Head Info New", route: "/headAdminConsoleMain" },
  {
    id: "roster_new",
    name: "Team Roster New",
    route: "/playerConsoleAdminMain",
  },
  { id: "picks", name: "Picks and Cash", route: "/picksMain" },
  { id: "logs", name: "Logs", route: "/logs" },
  { id: "penalties", name: "Penalties", route: "/penalties" },
  { id: "playerOption", name: "Player Option", route: "/playerOptionMain" },
  { id: "teamOption", name: "Team Option", route: "/teamOptionMain" },
  { id: "rfaAdminMain", name: "RFAAdmin", route: "/rfaAdminMain" },
  {
    id: "ufaAdminFirstRoundMain",
    name: "UFA 1R",
    route: "/ufaAdminFirstRoundMain",
  },
  {
    id: "ufaAdminSecondRoundMain",
    name: "UFA 2R",
    route: "/ufaAdminSecondRoundMain",
  },
  {
    id: "ufaAdminThirdRoundMain",
    name: "UFA 3R",
    route: "/ufaAdminThirdRoundMain",
  },
];
