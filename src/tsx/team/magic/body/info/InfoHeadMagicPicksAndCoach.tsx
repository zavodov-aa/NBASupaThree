import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./magicPicksAndCoach.css";

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

const InfoHeadMagicPicksAndCoach = () => {
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
          .eq("team_name", "Magic")
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
      .channel("head-magic-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Magic",
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
    return <div className="loading-text">Loading Magic Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="magic-containers">
      <div className="header-content">
        <h1 className="header-title-magic">MAGIC FRONT OFFICE</h1>
      </div>

      <div className="magic-picks-coach-card">
        {/* <div className="magic-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="magic-pc-sections-container">
          {/* Head Coach Section */}
          <div className="magic-pc-section">
            <div className="magic-pc-header">
              <div className="magic-coach-title-group">
                <h3 className="magic-pc-title">HEAD COACH</h3>
                <h4 className="magic-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="magic-coach-grid">
              <div className="magic-coach-column">
                <div className="coach-item-magic">
                  <span className="coach-position-magic">PG</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">SG</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">SF</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">PF</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="magic-coach-column">
                <div className="coach-item-magic">
                  <span className="coach-position-magic">C</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">STAR</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">START</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">BENCH</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="magic-coach-column">
                <div className="coach-item-magic">
                  <span className="coach-position-magic">G1</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">G2</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">G3</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-magic">
                  <span className="coach-position-magic">NEG</span>
                  <span className="coach-value-magic">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="magic-pc-section">
            <div className="magic-pc-header">
              <h3 className="magic-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="magic-picks-grid">
              <div className="magic-pick-column">
                <div className="magic-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-magic">
                  <span className="pick-round-magic">1 ROUND</span>
                  <span className="pick-value-magic">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-magic">
                  <span className="pick-round-magic">2 ROUND</span>
                  <span className="pick-value-magic">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="magic-pick-column">
                <div className="magic-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-magic">
                  <span className="pick-round-magic">1 ROUND</span>
                  <span className="pick-value-magic">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-magic">
                  <span className="pick-round-magic">2 ROUND</span>
                  <span className="pick-value-magic">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="magic-pick-column">
                <div className="magic-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-magic">
                  <span className="pick-round-magic">1 ROUND</span>
                  <span className="pick-value-magic">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-magic">
                  <span className="pick-round-magic">2 ROUND</span>
                  <span className="pick-value-magic">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="magic-pc-colors">
          <div className="color-dot-magic blue-dark-magic"></div>
          <div className="color-dot-magic blue-magic"></div>
          <div className="color-dot-magic silver-magic"></div>
          <div className="color-dot-magic black-magic"></div>
          <div className="color-dot-magic gray-light-magic"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadMagicPicksAndCoach;
