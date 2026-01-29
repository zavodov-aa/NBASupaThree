import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./warriorsInfoDesk.css";

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

const InfoHeadWarriorsInfoDesk = () => {
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
          .eq("team_name", "Warriors")
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
      .channel("hand-warriors-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Warriors",
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
    return <div className="loading-text">Loading Warriors Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="warriors-containers">
      <div className="header-content-warriors">
        <h1 className="header-title-warriors">INFO DESK</h1>
      </div>

      <div className="table-containersss-warriors desk-card-wrapper-warriors">
        <div className="warriors-desk-card">
          <div className="desk-accent-top-warriors"></div>

          <div className="desk-sections-horizontal-warriors">
            {/* Financial Overview Section */}
            <div className="desk-section-warriors">
              <div className="desk-header-warriors">
                <div className="desk-title-icon-warriors"></div>
                <h3 className="desk-title-warriors">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-warriors">
                <div className="desk-items-vertical-warriors">
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">SALARY CAP</span>
                    <span className="desk-value-warriors">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">CAP HIT</span>
                    <span className="desk-value-warriors">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-warriors highlight-positive-warriors">
                    <span className="desk-label-warriors">CAP SPACE</span>
                    <span className="desk-value-warriors">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">CASH MONEY</span>
                    <span className="desk-value-warriors">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">STANDINGS</span>
                    <span className="desk-value-warriors">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-warriors highlight-negative-warriors">
                    <span className="desk-label-warriors">PENALTIES</span>
                    <span className="desk-value-warriors">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-warriors">
              <div className="desk-header-warriors">
                <div className="desk-title-icon-warriors"></div>
                <h3 className="desk-title-warriors">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-warriors">
                <div className="desk-items-vertical-warriors">
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">ACTIVE ROSTER</span>
                    <span className="desk-value-warriors">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">DEAD CAP</span>
                    <span className="desk-value-warriors">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">G LEAGUE</span>
                    <span className="desk-value-warriors">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">EXTRA POS</span>
                    <span className="desk-value-warriors">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-warriors highlight-playoffs-warriors">
                    <span className="desk-label-warriors">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-warriors">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-warriors">
              <div className="desk-header-warriors">
                <div className="desk-title-icon-warriors"></div>
                <h3 className="desk-title-warriors">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-warriors">
                <div className="desk-items-vertical-warriors">
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">IN TEAM SINCE</span>
                    <span className="desk-value-warriors">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-warriors highlight-championship-warriors">
                    <span className="desk-label-warriors">CHAMPIONSHIPS</span>
                    <span className="desk-value-warriors">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">REGULAR BEST</span>
                    <span className="desk-value-warriors">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">DIVISION WINNER</span>
                    <span className="desk-value-warriors">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-warriors">
                    <span className="desk-label-warriors">PLAYOFFS</span>
                    <span className="desk-value-warriors">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-warriors highlight-championship-warriors">
                    <span className="desk-label-warriors">BEST RESULT</span>
                    <span className="desk-value-warriors">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-warriors">
            <div className="color-dot-warriors navy-warriors"></div>
            <div className="color-dot-warriors blue-warriors"></div>
            <div className="color-dot-warriors yellow-warriors"></div>
            <div className="color-dot-warriors gold-warriors"></div>
            <div className="color-dot-warriors white-warriors"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadWarriorsInfoDesk;
