import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./raptorsInfoDesk.css";

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

const InfoHeadRaptorsInfoDesk = () => {
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
          .eq("team_name", "Raptors")
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
      .channel("hand-raptors-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Raptors",
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
    return <div className="loading-text">Loading Raptors Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="raptors-containers">
      <div className="header-content-raptors">
        <h1 className="header-title-raptors">INFO DESK</h1>
      </div>

      <div className="table-containersss-raptors desk-card-wrapper-raptors">
        <div className="raptors-desk-card">
          <div className="desk-accent-top-raptors"></div>

          <div className="desk-sections-horizontal-raptors">
            {/* Financial Overview Section */}
            <div className="desk-section-raptors">
              <div className="desk-header-raptors">
                <div className="desk-title-icon-raptors"></div>
                <h3 className="desk-title-raptors">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-raptors">
                <div className="desk-items-vertical-raptors">
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">SALARY CAP</span>
                    <span className="desk-value-raptors">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">CAP HIT</span>
                    <span className="desk-value-raptors">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-raptors highlight-positive-raptors">
                    <span className="desk-label-raptors">CAP SPACE</span>
                    <span className="desk-value-raptors">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">CASH MONEY</span>
                    <span className="desk-value-raptors">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">STANDINGS</span>
                    <span className="desk-value-raptors">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-raptors highlight-negative-raptors">
                    <span className="desk-label-raptors">PENALTIES</span>
                    <span className="desk-value-raptors">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-raptors">
              <div className="desk-header-raptors">
                <div className="desk-title-icon-raptors"></div>
                <h3 className="desk-title-raptors">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-raptors">
                <div className="desk-items-vertical-raptors">
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">ACTIVE ROSTER</span>
                    <span className="desk-value-raptors">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">DEAD CAP</span>
                    <span className="desk-value-raptors">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">G LEAGUE</span>
                    <span className="desk-value-raptors">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">EXTRA POS</span>
                    <span className="desk-value-raptors">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-raptors highlight-playoffs-raptors">
                    <span className="desk-label-raptors">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-raptors">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-raptors">
              <div className="desk-header-raptors">
                <div className="desk-title-icon-raptors"></div>
                <h3 className="desk-title-raptors">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-raptors">
                <div className="desk-items-vertical-raptors">
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">IN TEAM SINCE</span>
                    <span className="desk-value-raptors">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-raptors highlight-championship-raptors">
                    <span className="desk-label-raptors">CHAMPIONSHIPS</span>
                    <span className="desk-value-raptors">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">REGULAR BEST</span>
                    <span className="desk-value-raptors">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">DIVISION WINNER</span>
                    <span className="desk-value-raptors">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-raptors">
                    <span className="desk-label-raptors">PLAYOFFS</span>
                    <span className="desk-value-raptors">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-raptors highlight-championship-raptors">
                    <span className="desk-label-raptors">BEST RESULT</span>
                    <span className="desk-value-raptors">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-raptors">
            <div className="color-dot-raptors red-dark-raptors"></div>
            <div className="color-dot-raptors red-raptors"></div>
            <div className="color-dot-raptors black-raptors"></div>
            <div className="color-dot-raptors silver-raptors"></div>
            <div className="color-dot-raptors gold-light-raptors"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadRaptorsInfoDesk;
