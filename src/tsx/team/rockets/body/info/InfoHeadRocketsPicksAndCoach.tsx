import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./rocketsPicksAndCoach.css";

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

const InfoHeadRocketsPicksAndCoach = () => {
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
          .eq("team_name", "Rockets")
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
      .channel("head-rockets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Rockets",
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
    return <div className="loading-text">Loading Rockets Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="rockets-containers">
      <div className="header-content">
        <h1 className="header-title-rockets">ROCKETS FRONT OFFICE</h1>
      </div>

      <div className="rockets-picks-coach-card">
        {/* <div className="rockets-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="rockets-pc-sections-container">
          {/* Head Coach Section */}
          <div className="rockets-pc-section">
            <div className="rockets-pc-header">
              <div className="rockets-coach-title-group">
                <h3 className="rockets-pc-title">HEAD COACH</h3>
                <h4 className="rockets-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="rockets-coach-grid">
              <div className="rockets-coach-column">
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">PG</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">SG</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">SF</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">PF</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="rockets-coach-column">
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">C</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">STAR</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">START</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">BENCH</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="rockets-coach-column">
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">G1</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">G2</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">G3</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-rockets">
                  <span className="coach-position-rockets">NEG</span>
                  <span className="coach-value-rockets">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="rockets-pc-section">
            <div className="rockets-pc-header">
              <h3 className="rockets-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="rockets-picks-grid">
              <div className="rockets-pick-column">
                <div className="rockets-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-rockets">
                  <span className="pick-round-rockets">1 ROUND</span>
                  <span className="pick-value-rockets">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-rockets">
                  <span className="pick-round-rockets">2 ROUND</span>
                  <span className="pick-value-rockets">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="rockets-pick-column">
                <div className="rockets-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-rockets">
                  <span className="pick-round-rockets">1 ROUND</span>
                  <span className="pick-value-rockets">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-rockets">
                  <span className="pick-round-rockets">2 ROUND</span>
                  <span className="pick-value-rockets">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="rockets-pick-column">
                <div className="rockets-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-rockets">
                  <span className="pick-round-rockets">1 ROUND</span>
                  <span className="pick-value-rockets">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-rockets">
                  <span className="pick-round-rockets">2 ROUND</span>
                  <span className="pick-value-rockets">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rockets-pc-colors">
          <div className="color-dot-rockets red-dark-rockets"></div>
          <div className="color-dot-rockets red-rockets"></div>
          <div className="color-dot-rockets silver-rockets"></div>
          <div className="color-dot-rockets black-rockets"></div>
          <div className="color-dot-rockets white-rockets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadRocketsPicksAndCoach;
