import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./netsPicksAndCoach.css";

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

const InfoHeadNetsPicksAndCoach = () => {
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
          .eq("team_name", "Nets")
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
      .channel("head-nets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Nets",
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
    return <div className="loading-text">Loading Nets Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="nets-containers">
      <div className="header-content">
        <h1 className="header-title-nets">NETS FRONT OFFICE</h1>
      </div>

      <div className="nets-picks-coach-card">
        {/* <div className="nets-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="nets-pc-sections-container">
          {/* Head Coach Section */}
          <div className="nets-pc-section">
            <div className="nets-pc-header">
              <div className="nets-coach-title-group">
                <h3 className="nets-pc-title">HEAD COACH</h3>
                <h4 className="nets-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="nets-coach-grid">
              <div className="nets-coach-column">
                <div className="coach-item-nets">
                  <span className="coach-position-nets">PG</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">SG</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">SF</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">PF</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="nets-coach-column">
                <div className="coach-item-nets">
                  <span className="coach-position-nets">C</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">STAR</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">START</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">BENCH</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="nets-coach-column">
                <div className="coach-item-nets">
                  <span className="coach-position-nets">G1</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">G2</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">G3</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-nets">
                  <span className="coach-position-nets">NEG</span>
                  <span className="coach-value-nets">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="nets-pc-section">
            <div className="nets-pc-header">
              <h3 className="nets-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="nets-picks-grid">
              <div className="nets-pick-column">
                <div className="nets-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-nets">
                  <span className="pick-round-nets">1 ROUND</span>
                  <span className="pick-value-nets">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-nets">
                  <span className="pick-round-nets">2 ROUND</span>
                  <span className="pick-value-nets">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="nets-pick-column">
                <div className="nets-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-nets">
                  <span className="pick-round-nets">1 ROUND</span>
                  <span className="pick-value-nets">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-nets">
                  <span className="pick-round-nets">2 ROUND</span>
                  <span className="pick-value-nets">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="nets-pick-column">
                <div className="nets-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-nets">
                  <span className="pick-round-nets">1 ROUND</span>
                  <span className="pick-value-nets">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-nets">
                  <span className="pick-round-nets">2 ROUND</span>
                  <span className="pick-value-nets">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="nets-pc-colors">
          <div className="color-dot-nets black-dark-nets"></div>
          <div className="color-dot-nets black-nets"></div>
          <div className="color-dot-nets gray-dark-nets"></div>
          <div className="color-dot-nets silver-nets"></div>
          <div className="color-dot-nets silver-light-nets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadNetsPicksAndCoach;
