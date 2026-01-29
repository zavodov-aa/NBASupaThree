import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./heatInfoDesk.css";

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

const InfoHeadHeatInfoDesk = () => {
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
          .eq("team_name", "Heat")
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
      .channel("hand-heat-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Heat",
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
    return <div className="loading-text">Loading Heat Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="heat-containers">
      <div className="header-content-heat">
        <h1 className="header-title-heat">INFO DESK</h1>
      </div>

      <div className="table-containersss-heat desk-card-wrapper-heat">
        <div className="heat-desk-card">
          <div className="desk-accent-top-heat"></div>

          <div className="desk-sections-horizontal-heat">
            {/* Financial Overview Section */}
            <div className="desk-section-heat">
              <div className="desk-header-heat">
                <div className="desk-title-icon-heat"></div>
                <h3 className="desk-title-heat">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-heat">
                <div className="desk-items-vertical-heat">
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">SALARY CAP</span>
                    <span className="desk-value-heat">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">CAP HIT</span>
                    <span className="desk-value-heat">{teamData?.cap_hit}</span>
                  </div>
                  <div className="desk-item-heat highlight-positive-heat">
                    <span className="desk-label-heat">CAP SPACE</span>
                    <span className="desk-value-heat">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">CASH MONEY</span>
                    <span className="desk-value-heat">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">STANDINGS</span>
                    <span className="desk-value-heat">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-heat highlight-negative-heat">
                    <span className="desk-label-heat">PENALTIES</span>
                    <span className="desk-value-heat">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-heat">
              <div className="desk-header-heat">
                <div className="desk-title-icon-heat"></div>
                <h3 className="desk-title-heat">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-heat">
                <div className="desk-items-vertical-heat">
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">ACTIVE ROSTER</span>
                    <span className="desk-value-heat">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">DEAD CAP</span>
                    <span className="desk-value-heat">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">G LEAGUE</span>
                    <span className="desk-value-heat">{teamData?.g_leage}</span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">EXTRA POS</span>
                    <span className="desk-value-heat">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-heat highlight-playoffs-heat">
                    <span className="desk-label-heat">LAST SEASON RESULT</span>
                    <span className="desk-value-heat">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-heat">
              <div className="desk-header-heat">
                <div className="desk-title-icon-heat"></div>
                <h3 className="desk-title-heat">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-heat">
                <div className="desk-items-vertical-heat">
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">IN TEAM SINCE</span>
                    <span className="desk-value-heat">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-heat highlight-championship-heat">
                    <span className="desk-label-heat">CHAMPIONSHIPS</span>
                    <span className="desk-value-heat">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">REGULAR BEST</span>
                    <span className="desk-value-heat">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">DIVISION WINNER</span>
                    <span className="desk-value-heat">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-heat">
                    <span className="desk-label-heat">PLAYOFFS</span>
                    <span className="desk-value-heat">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-heat highlight-championship-heat">
                    <span className="desk-label-heat">BEST RESULT</span>
                    <span className="desk-value-heat">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-heat">
            <div className="color-dot-heat red-dark-heat"></div>
            <div className="color-dot-heat red-heat"></div>
            <div className="color-dot-heat red-light-heat"></div>
            <div className="color-dot-heat yellow-heat"></div>
            <div className="color-dot-heat yellow-light-heat"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHeatInfoDesk;
