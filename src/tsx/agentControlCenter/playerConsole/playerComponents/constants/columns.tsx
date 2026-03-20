import { Player } from "../types/Player";

export const initialColumns: (keyof Player)[] = [
  "id",
  "active_roster",
  "position",
  "team",
  "age",
  "year_one",
  "year_two",
  "opt",
  "exp",
  "rating",
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
  "exp",
  "bird",
  "awards",
  "team",
  "g_league",
  "rating",
  "rokie",
];

export const columnGroups: Record<string, (keyof Player)[]> = {
  "Basic Info": [
    "id",
    "active_roster",
    "position",
    "pos_elig",
    "age",
    "team",
    "rating",
    "g_league",
  ],
  "Contract Years": [
    "year_one",
    "year_two",
    "year_three",
    "year_four",
    "year_five",
  ],
  "Player Details": ["opt", "exp", "bird", "awards", "rokie"],
};
