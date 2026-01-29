import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./wizardsPicksAndCoach.css";

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

const InfoHeadWizardsPicksAndCoach = () => {
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
          .eq("team_name", "Wizards")
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
      .channel("head-wizards-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Wizards",
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
    return <div className="loading-text">Loading Wizards Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="wizards-containers">
      <div className="header-content">
        <h1 className="header-title-wizards">WIZARDS FRONT OFFICE</h1>
      </div>

      <div className="wizards-picks-coach-card">
        {/* <div className="wizards-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="wizards-pc-sections-container">
          {/* Head Coach Section */}
          <div className="wizards-pc-section">
            <div className="wizards-pc-header">
              <div className="wizards-coach-title-group">
                <h3 className="wizards-pc-title">HEAD COACH</h3>
                <h4 className="wizards-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="wizards-coach-grid">
              <div className="wizards-coach-column">
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">PG</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">SG</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">SF</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">PF</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="wizards-coach-column">
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">C</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">STAR</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">START</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">BENCH</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="wizards-coach-column">
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">G1</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">G2</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">G3</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-wizards">
                  <span className="coach-position-wizards">NEG</span>
                  <span className="coach-value-wizards">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="wizards-pc-section">
            <div className="wizards-pc-header">
              <h3 className="wizards-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="wizards-picks-grid">
              <div className="wizards-pick-column">
                <div className="wizards-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-wizards">
                  <span className="pick-round-wizards">1 ROUND</span>
                  <span className="pick-value-wizards">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-wizards">
                  <span className="pick-round-wizards">2 ROUND</span>
                  <span className="pick-value-wizards">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="wizards-pick-column">
                <div className="wizards-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-wizards">
                  <span className="pick-round-wizards">1 ROUND</span>
                  <span className="pick-value-wizards">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-wizards">
                  <span className="pick-round-wizards">2 ROUND</span>
                  <span className="pick-value-wizards">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="wizards-pick-column">
                <div className="wizards-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-wizards">
                  <span className="pick-round-wizards">1 ROUND</span>
                  <span className="pick-value-wizards">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-wizards">
                  <span className="pick-round-wizards">2 ROUND</span>
                  <span className="pick-value-wizards">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wizards-pc-colors">
          <div className="color-dot-wizards blue-dark-wizards"></div>
          <div className="color-dot-wizards blue-wizards"></div>
          <div className="color-dot-wizards red-wizards"></div>
          <div className="color-dot-wizards silver-wizards"></div>
          <div className="color-dot-wizards navy-wizards"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadWizardsPicksAndCoach;
