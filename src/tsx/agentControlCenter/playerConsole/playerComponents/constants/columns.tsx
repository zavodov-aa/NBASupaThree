import { Player } from "../types/Player";

export const initialColumns: (keyof Player)[] = [
  "id",
  "active_roster",
  "position",
  "team",
  "age",
  "opt",
  "status",
  "year_one",
  "year_two",

  "exp",
  "rating",
  "g_league",

  // -----
  "retention",
  "dead_cap_team",
  "dc_year_one",
  "dc_year_two",
  // "dc_year_three",
  // "dc_year_four",
  // "dc_year_five",
];

export const allColumns: (keyof Player)[] = [
  "id",
  "active_roster",
  "position",
  "pos_elig",
  "age",
  "year_one",
  "year_two",
  "year_three",
  "year_four",
  "year_five",
  "opt",
  "status",
  "exp",
  "bird",
  "awards",
  "team",
  "g_league",
  "rating",
  "rokie",

  // -----------
  "retention",
  "dead_cap_team",
  "dc_year_one",
  "dc_year_two",
  "dc_year_three",
  "dc_year_four",
  "dc_year_five",
];

export const columnGroups: Record<string, (keyof Player)[]> = {
  "Basic Info": [
    "id",
    "active_roster",
    "team",
    "dead_cap_team",
    "g_league",
    "position",
    "pos_elig",
    "age",

    "rating",
  ],
  "Contract Years": [
    "year_one",
    "year_two",
    "year_three",
    "year_four",
    "year_five",
    "dc_year_one",
    "dc_year_two",
    "dc_year_three",
    "dc_year_four",
    "dc_year_five",
  ],
  "Player Details": [
    "opt",
    "status",
    "exp",
    "bird",
    "awards",
    "rokie",
    "retention",
  ],
};
