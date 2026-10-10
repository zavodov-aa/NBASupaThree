export type Player = {
  id: number;
  active_roster: string;
  position: string;
  pos_elig: string;
  age: string | null;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  opt: string;
  status: string;
  exp: string;
  bird: string;
  awards: string;
  team: string;
  g_league: string;
  rating: string;
  rokie: string;

  // ----------
  retention: string;
  dead_cap_team: string;
  dc_year_one: string;
  dc_year_two: string;
  dc_year_three: string;
  dc_year_four: string;
  dc_year_five: string;
};
