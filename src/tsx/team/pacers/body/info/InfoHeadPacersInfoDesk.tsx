import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./pacersInfoDesk.css";

interface TeamData {
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
}

const InfoHeadPacersInfoDesk = () => {
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
      .channel("hand-pacers-changes")
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

  if (loading)
    return <div className="loading-text">Loading Pacers Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="pacers-containers">
      <div className="header-content-pacers">
        <h1 className="header-title-pacers">INFO DESK</h1>
      </div>

      <div className="table-containersss-pacers desk-card-wrapper-pacers">
        <div className="pacers-desk-card">
          <div className="desk-accent-top-pacers"></div>

          <div className="desk-sections-horizontal-pacers">
            {/* Financial Overview Section */}
            <div className="desk-section-pacers">
              <div className="desk-header-pacers">
                <div className="desk-title-icon-pacers"></div>
                <h3 className="desk-title-pacers">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-pacers">
                <div className="desk-items-vertical-pacers">
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">SALARY CAP</span>
                    <span className="desk-value-pacers">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">CAP HIT</span>
                    <span className="desk-value-pacers">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-pacers highlight-positive-pacers">
                    <span className="desk-label-pacers">CAP SPACE</span>
                    <span className="desk-value-pacers">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">CASH MONEY</span>
                    <span className="desk-value-pacers">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">STANDINGS</span>
                    <span className="desk-value-pacers">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-pacers highlight-negative-pacers">
                    <span className="desk-label-pacers">PENALTIES</span>
                    <span className="desk-value-pacers">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-pacers">
              <div className="desk-header-pacers">
                <div className="desk-title-icon-pacers"></div>
                <h3 className="desk-title-pacers">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-pacers">
                <div className="desk-items-vertical-pacers">
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">ACTIVE ROSTER</span>
                    <span className="desk-value-pacers">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">DEAD CAP</span>
                    <span className="desk-value-pacers">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">G LEAGUE</span>
                    <span className="desk-value-pacers">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">EXTRA POS</span>
                    <span className="desk-value-pacers">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-pacers highlight-playoffs-pacers">
                    <span className="desk-label-pacers">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-pacers">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-pacers">
              <div className="desk-header-pacers">
                <div className="desk-title-icon-pacers"></div>
                <h3 className="desk-title-pacers">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-pacers">
                <div className="desk-items-vertical-pacers">
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">IN TEAM SINCE</span>
                    <span className="desk-value-pacers">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-pacers highlight-championship-pacers">
                    <span className="desk-label-pacers">CHAMPIONSHIPS</span>
                    <span className="desk-value-pacers">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">REGULAR BEST</span>
                    <span className="desk-value-pacers">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">DIVISION WINNER</span>
                    <span className="desk-value-pacers">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-pacers">
                    <span className="desk-label-pacers">PLAYOFFS</span>
                    <span className="desk-value-pacers">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-pacers highlight-championship-pacers">
                    <span className="desk-label-pacers">BEST RESULT</span>
                    <span className="desk-value-pacers">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-pacers">
            <div className="color-dot-pacers navy-dark-pacers"></div>
            <div className="color-dot-pacers navy-pacers"></div>
            <div className="color-dot-pacers gold-pacers"></div>
            <div className="color-dot-pacers gold-light-pacers"></div>
            <div className="color-dot-pacers silver-pacers"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPacersInfoDesk;
