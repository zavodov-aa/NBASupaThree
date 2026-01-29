import React from "react";
import { createClient } from "@supabase/supabase-js";
import "./infoHeadHeat.css";
import InfoHeadHeatLogoAndInfo from "./InfoHeadHeatLogoAndInfo";
import InfoHeadHeatInfoDesk from "./InfoHeadHeatInfoDesk";
import InfoHeadHeatPicksAndCoach from "./InfoHeadHeatPicksAndCoach";

type InfoHead = {
  id: string;
  logo: string;
  conference: string;
  division: string;
  gm: string;
  salary_cap: string;
  cap_hit: string;
  cap_space: string;
  cash_money: string;
  standing: string;
  penalties: string;
  active_roster: string;
  dead_cap: string;
  g_leage: string;
  extra_pos: string;
  last_season_result: string;
  in_team_since: string;
  championships: string;
  regular_best: string;
  division_winner: string;
  playoffs: string;
  best_result: string;
  head_coach: string;
  name_coach: string;
  coach_pg: string;
  coach_sg: string;
  coach_sf: string;
  coach_pf: string;
  coach_c: string;
  coach_star: string;
  coach_start: string;
  coach_bench: string;
  coach_g1: string;
  coach_g2: string;
  coach_g3: string;
  coach_neg: string;
  year_pick_one: string;
  draft_pick_one_1r: string;
  draft_pick_one_2r: string;
  year_pick_two: string;
  draft_pick_two_1r: string;
  draft_pick_two_2r: string;
  year_pick_three: string;
  draft_pick_three_1r: string;
  draft_pick_three_2r: string;
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const InfoHeadHeat = () => {
  return (
    <div className="HeatHeadInfo">
      <InfoHeadHeatLogoAndInfo />
      <InfoHeadHeatInfoDesk />
      <InfoHeadHeatPicksAndCoach />
    </div>
  );
};

export default InfoHeadHeat;
