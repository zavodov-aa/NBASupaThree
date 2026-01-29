import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./netsInfoDesk.css";

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

const InfoHeadNetsInfoDesk = () => {
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
      .channel("hand-nets-changes")
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

  if (loading)
    return <div className="loading-text">Loading Nets Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="nets-containers">
      <div className="header-content-nets">
        <h1 className="header-title-nets">INFO DESK</h1>
      </div>

      <div className="table-containersss-nets desk-card-wrapper-nets">
        <div className="nets-desk-card">
          <div className="desk-accent-top-nets"></div>

          <div className="desk-sections-horizontal-nets">
            {/* Financial Overview Section */}
            <div className="desk-section-nets">
              <div className="desk-header-nets">
                <div className="desk-title-icon-nets"></div>
                <h3 className="desk-title-nets">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-nets">
                <div className="desk-items-vertical-nets">
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">SALARY CAP</span>
                    <span className="desk-value-nets">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">CAP HIT</span>
                    <span className="desk-value-nets">{teamData?.cap_hit}</span>
                  </div>
                  <div className="desk-item-nets highlight-positive-nets">
                    <span className="desk-label-nets">CAP SPACE</span>
                    <span className="desk-value-nets">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">CASH MONEY</span>
                    <span className="desk-value-nets">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">STANDINGS</span>
                    <span className="desk-value-nets">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-nets highlight-negative-nets">
                    <span className="desk-label-nets">PENALTIES</span>
                    <span className="desk-value-nets">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-nets">
              <div className="desk-header-nets">
                <div className="desk-title-icon-nets"></div>
                <h3 className="desk-title-nets">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-nets">
                <div className="desk-items-vertical-nets">
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">ACTIVE ROSTER</span>
                    <span className="desk-value-nets">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">DEAD CAP</span>
                    <span className="desk-value-nets">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">G LEAGUE</span>
                    <span className="desk-value-nets">{teamData?.g_leage}</span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">EXTRA POS</span>
                    <span className="desk-value-nets">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-nets highlight-playoffs-nets">
                    <span className="desk-label-nets">LAST SEASON RESULT</span>
                    <span className="desk-value-nets">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-nets">
              <div className="desk-header-nets">
                <div className="desk-title-icon-nets"></div>
                <h3 className="desk-title-nets">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-nets">
                <div className="desk-items-vertical-nets">
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">IN TEAM SINCE</span>
                    <span className="desk-value-nets">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-nets highlight-championship-nets">
                    <span className="desk-label-nets">CHAMPIONSHIPS</span>
                    <span className="desk-value-nets">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">REGULAR BEST</span>
                    <span className="desk-value-nets">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">DIVISION WINNER</span>
                    <span className="desk-value-nets">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-nets">
                    <span className="desk-label-nets">PLAYOFFS</span>
                    <span className="desk-value-nets">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-nets highlight-championship-nets">
                    <span className="desk-label-nets">BEST RESULT</span>
                    <span className="desk-value-nets">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-nets">
            <div className="color-dot-nets black-nets"></div>
            <div className="color-dot-nets black-dark-nets"></div>
            <div className="color-dot-nets white-nets"></div>
            <div className="color-dot-nets silver-nets"></div>
            <div className="color-dot-nets gray-nets"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadNetsInfoDesk;
