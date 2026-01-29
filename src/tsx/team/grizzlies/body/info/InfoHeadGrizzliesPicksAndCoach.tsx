import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./grizzliesPicksAndCoach.css";

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

const InfoHeadGrizzliesPicksAndCoach = () => {
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
          .eq("team_name", "Grizzlies")
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
      .channel("head-grizzlies-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Grizzlies",
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
      <div className="loading-text">Loading Grizzlies Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="grizzlies-containers">
      <div className="header-content">
        <h1 className="header-title-grizzlies">GRIZZLIES FRONT OFFICE</h1>
      </div>

      <div className="grizzlies-picks-coach-card">
        {/* <div className="grizzlies-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="grizzlies-pc-sections-container">
          {/* Head Coach Section */}
          <div className="grizzlies-pc-section">
            <div className="grizzlies-pc-header">
              <div className="grizzlies-coach-title-group">
                <h3 className="grizzlies-pc-title">HEAD COACH</h3>
                <h4 className="grizzlies-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="grizzlies-coach-grid">
              <div className="grizzlies-coach-column">
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">PG</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">SG</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">SF</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">PF</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="grizzlies-coach-column">
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">C</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">STAR</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">START</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">BENCH</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="grizzlies-coach-column">
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">G1</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">G2</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">G3</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-grizzlies">
                  <span className="coach-position-grizzlies">NEG</span>
                  <span className="coach-value-grizzlies">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="grizzlies-pc-section">
            <div className="grizzlies-pc-header">
              <h3 className="grizzlies-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="grizzlies-picks-grid">
              <div className="grizzlies-pick-column">
                <div className="grizzlies-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-grizzlies">
                  <span className="pick-round-grizzlies">1 ROUND</span>
                  <span className="pick-value-grizzlies">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-grizzlies">
                  <span className="pick-round-grizzlies">2 ROUND</span>
                  <span className="pick-value-grizzlies">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="grizzlies-pick-column">
                <div className="grizzlies-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-grizzlies">
                  <span className="pick-round-grizzlies">1 ROUND</span>
                  <span className="pick-value-grizzlies">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-grizzlies">
                  <span className="pick-round-grizzlies">2 ROUND</span>
                  <span className="pick-value-grizzlies">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="grizzlies-pick-column">
                <div className="grizzlies-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-grizzlies">
                  <span className="pick-round-grizzlies">1 ROUND</span>
                  <span className="pick-value-grizzlies">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-grizzlies">
                  <span className="pick-round-grizzlies">2 ROUND</span>
                  <span className="pick-value-grizzlies">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grizzlies-pc-colors">
          <div className="color-dot-grizzlies navy-grizzlies"></div>
          <div className="color-dot-grizzlies blue-grizzlies"></div>
          <div className="color-dot-grizzlies yellow-grizzlies"></div>
          <div className="color-dot-grizzlies red-grizzlies"></div>
          <div className="color-dot-grizzlies light-blue-grizzlies"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadGrizzliesPicksAndCoach;
