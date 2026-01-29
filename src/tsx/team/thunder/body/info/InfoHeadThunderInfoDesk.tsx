import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./thunderInfoDesk.css";

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

const InfoHeadThunderInfoDesk = () => {
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
          .eq("team_name", "Thunder")
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
      .channel("hand-thunder-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Thunder",
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
    return <div className="loading-text">Loading Thunder Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="thunder-containers">
      <div className="header-content-thunder">
        <h1 className="header-title-thunder">INFO DESK</h1>
      </div>

      <div className="table-containersss-thunder desk-card-wrapper-thunder">
        <div className="thunder-desk-card">
          <div className="desk-accent-top-thunder"></div>

          <div className="desk-sections-horizontal-thunder">
            {/* Financial Overview Section */}
            <div className="desk-section-thunder">
              <div className="desk-header-thunder">
                <div className="desk-title-icon-thunder"></div>
                <h3 className="desk-title-thunder">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-thunder">
                <div className="desk-items-vertical-thunder">
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">SALARY CAP</span>
                    <span className="desk-value-thunder">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">CAP HIT</span>
                    <span className="desk-value-thunder">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-thunder highlight-positive-thunder">
                    <span className="desk-label-thunder">CAP SPACE</span>
                    <span className="desk-value-thunder">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">CASH MONEY</span>
                    <span className="desk-value-thunder">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">STANDINGS</span>
                    <span className="desk-value-thunder">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-thunder highlight-negative-thunder">
                    <span className="desk-label-thunder">PENALTIES</span>
                    <span className="desk-value-thunder">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-thunder">
              <div className="desk-header-thunder">
                <div className="desk-title-icon-thunder"></div>
                <h3 className="desk-title-thunder">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-thunder">
                <div className="desk-items-vertical-thunder">
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">ACTIVE ROSTER</span>
                    <span className="desk-value-thunder">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">DEAD CAP</span>
                    <span className="desk-value-thunder">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">G LEAGUE</span>
                    <span className="desk-value-thunder">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">EXTRA POS</span>
                    <span className="desk-value-thunder">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-thunder highlight-playoffs-thunder">
                    <span className="desk-label-thunder">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-thunder">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-thunder">
              <div className="desk-header-thunder">
                <div className="desk-title-icon-thunder"></div>
                <h3 className="desk-title-thunder">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-thunder">
                <div className="desk-items-vertical-thunder">
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">IN TEAM SINCE</span>
                    <span className="desk-value-thunder">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-thunder highlight-championship-thunder">
                    <span className="desk-label-thunder">CHAMPIONSHIPS</span>
                    <span className="desk-value-thunder">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">REGULAR BEST</span>
                    <span className="desk-value-thunder">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">DIVISION WINNER</span>
                    <span className="desk-value-thunder">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-thunder">
                    <span className="desk-label-thunder">PLAYOFFS</span>
                    <span className="desk-value-thunder">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-thunder highlight-championship-thunder">
                    <span className="desk-label-thunder">BEST RESULT</span>
                    <span className="desk-value-thunder">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-thunder">
            <div className="color-dot-thunder thunder-blue-dark"></div>
            <div className="color-dot-thunder thunder-blue"></div>
            <div className="color-dot-thunder thunder-orange"></div>
            <div className="color-dot-thunder thunder-yellow"></div>
            <div className="color-dot-thunder thunder-sunset"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadThunderInfoDesk;
