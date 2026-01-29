import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./timberwolvesPicksAndCoach.css";

interface TeamData {
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
}

const InfoHeadHawksPicksAndCoach = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Head")
          .select("*")
          .eq("team_name", "Timberwolves")
          .single();

        if (error) throw error;
        setTeamData(data as TeamData);
        setError(null);
      } catch (error: any) {
        setError(`Failed to load team data: ${error.message}`);
        setTeamData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();

    const subscription = supabase
      .channel("head-timberwolves-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Timberwolves",
        },
        () => {
          fetchTeamData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-text">Loading Timberwolves Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="timberwolves-containers">
      <div className="header-content">
        <h1 className="header-title-timberwolves">TIMBERWOLVES FRONT OFFICE</h1>
      </div>

      <div className="timberwolves-picks-coach-card">
        {/* <div className="timberwolves-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="timberwolves-pc-sections-container">
          {/* Head Coach Section */}
          <div className="timberwolves-pc-section">
            <div className="timberwolves-pc-header">
              <div className="timberwolves-coach-title-group">
                <h3 className="timberwolves-pc-title">HEAD COACH</h3>
                <h4 className="timberwolves-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="timberwolves-coach-grid">
              <div className="timberwolves-coach-column">
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">PG</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">SG</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">SF</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">PF</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="timberwolves-coach-column">
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">C</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">STAR</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">START</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">BENCH</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="timberwolves-coach-column">
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">G1</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">G2</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">G3</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-timberwolves">
                  <span className="coach-position-timberwolves">NEG</span>
                  <span className="coach-value-timberwolves">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="timberwolves-pc-section">
            <div className="timberwolves-pc-header">
              <h3 className="timberwolves-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="timberwolves-picks-grid">
              <div className="timberwolves-pick-column">
                <div className="timberwolves-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-timberwolves">
                  <span className="pick-round-timberwolves">1 ROUND</span>
                  <span className="pick-value-timberwolves">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-timberwolves">
                  <span className="pick-round-timberwolves">2 ROUND</span>
                  <span className="pick-value-timberwolves">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="timberwolves-pick-column">
                <div className="timberwolves-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-timberwolves">
                  <span className="pick-round-timberwolves">1 ROUND</span>
                  <span className="pick-value-timberwolves">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-timberwolves">
                  <span className="pick-round-timberwolves">2 ROUND</span>
                  <span className="pick-value-timberwolves">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="timberwolves-pick-column">
                <div className="timberwolves-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-timberwolves">
                  <span className="pick-round-timberwolves">1 ROUND</span>
                  <span className="pick-value-timberwolves">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-timberwolves">
                  <span className="pick-round-timberwolves">2 ROUND</span>
                  <span className="pick-value-timberwolves">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="timberwolves-pc-colors">
          <div className="color-dot-timberwolves blue-dark-timberwolves"></div>
          <div className="color-dot-timberwolves blue-timberwolves"></div>
          <div className="color-dot-timberwolves green-timberwolves"></div>
          <div className="color-dot-timberwolves silver-timberwolves"></div>
          <div className="color-dot-timberwolves white-timberwolves"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksPicksAndCoach;
