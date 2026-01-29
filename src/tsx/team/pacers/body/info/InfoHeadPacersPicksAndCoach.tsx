import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./pacersPicksAndCoach.css"; // Оставил старый импорт CSS, но в файле мы его переименуем

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

const InfoHeadPacersPicksAndCoach = () => {
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
          .eq("team_name", "Pacers")
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
      .channel("head-pacers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pacers",
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
    return <div className="loading-text">Loading Pacers Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="pacers-containers">
      <div className="header-content">
        <h1 className="header-title-pacers">PACERS FRONT OFFICE</h1>
      </div>

      <div className="pacers-picks-coach-card">
        {/* <div className="pacers-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="pacers-pc-sections-container">
          {/* Head Coach Section */}
          <div className="pacers-pc-section">
            <div className="pacers-pc-header">
              <div className="pacers-coach-title-group">
                <h3 className="pacers-pc-title">HEAD COACH</h3>
                <h4 className="pacers-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="pacers-coach-grid">
              <div className="pacers-coach-column">
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">PG</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">SG</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">SF</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">PF</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="pacers-coach-column">
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">C</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">STAR</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">START</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">BENCH</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="pacers-coach-column">
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">G1</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">G2</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">G3</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-pacers">
                  <span className="coach-position-pacers">NEG</span>
                  <span className="coach-value-pacers">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="pacers-pc-section">
            <div className="pacers-pc-header">
              <h3 className="pacers-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="pacers-picks-grid">
              <div className="pacers-pick-column">
                <div className="pacers-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-pacers">
                  <span className="pick-round-pacers">1 ROUND</span>
                  <span className="pick-value-pacers">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pacers">
                  <span className="pick-round-pacers">2 ROUND</span>
                  <span className="pick-value-pacers">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="pacers-pick-column">
                <div className="pacers-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-pacers">
                  <span className="pick-round-pacers">1 ROUND</span>
                  <span className="pick-value-pacers">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pacers">
                  <span className="pick-round-pacers">2 ROUND</span>
                  <span className="pick-value-pacers">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="pacers-pick-column">
                <div className="pacers-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-pacers">
                  <span className="pick-round-pacers">1 ROUND</span>
                  <span className="pick-value-pacers">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pacers">
                  <span className="pick-round-pacers">2 ROUND</span>
                  <span className="pick-value-pacers">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pacers-pc-colors">
          <div className="color-dot-pacers blue-dark-pacers"></div>
          <div className="color-dot-pacers blue-pacers"></div>
          <div className="color-dot-pacers blue-light-pacers"></div>
          <div className="color-dot-pacers gold-pacers"></div>
          <div className="color-dot-pacers gold-light-pacers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPacersPicksAndCoach;
