import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./knicksInfoDesk.css";

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

const InfoHeadKnicksInfoDesk = () => {
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
          .eq("team_name", "Knicks")
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
      .channel("hand-knicks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Knicks",
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
    return <div className="loading-text">Loading Knicks Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="knicks-containers">
      <div className="header-content-knicks">
        <h1 className="header-title-knicks">INFO DESK</h1>
      </div>

      <div className="table-containersss-knicks desk-card-wrapper-knicks">
        <div className="knicks-desk-card">
          <div className="desk-accent-top-knicks"></div>

          <div className="desk-sections-horizontal-knicks">
            {/* Financial Overview Section */}
            <div className="desk-section-knicks">
              <div className="desk-header-knicks">
                <div className="desk-title-icon-knicks"></div>
                <h3 className="desk-title-knicks">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-knicks">
                <div className="desk-items-vertical-knicks">
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">SALARY CAP</span>
                    <span className="desk-value-knicks">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">CAP HIT</span>
                    <span className="desk-value-knicks">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-knicks highlight-positive-knicks">
                    <span className="desk-label-knicks">CAP SPACE</span>
                    <span className="desk-value-knicks">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">CASH MONEY</span>
                    <span className="desk-value-knicks">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">STANDINGS</span>
                    <span className="desk-value-knicks">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-knicks highlight-negative-knicks">
                    <span className="desk-label-knicks">PENALTIES</span>
                    <span className="desk-value-knicks">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-knicks">
              <div className="desk-header-knicks">
                <div className="desk-title-icon-knicks"></div>
                <h3 className="desk-title-knicks">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-knicks">
                <div className="desk-items-vertical-knicks">
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">ACTIVE ROSTER</span>
                    <span className="desk-value-knicks">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">DEAD CAP</span>
                    <span className="desk-value-knicks">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">G LEAGUE</span>
                    <span className="desk-value-knicks">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">EXTRA POS</span>
                    <span className="desk-value-knicks">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-knicks highlight-playoffs-knicks">
                    <span className="desk-label-knicks">LAST SEASON RESULT</span>
                    <span className="desk-value-knicks">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-knicks">
              <div className="desk-header-knicks">
                <div className="desk-title-icon-knicks"></div>
                <h3 className="desk-title-knicks">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-knicks">
                <div className="desk-items-vertical-knicks">
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">IN TEAM SINCE</span>
                    <span className="desk-value-knicks">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-knicks highlight-championship-knicks">
                    <span className="desk-label-knicks">CHAMPIONSHIPS</span>
                    <span className="desk-value-knicks">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">REGULAR BEST</span>
                    <span className="desk-value-knicks">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">DIVISION WINNER</span>
                    <span className="desk-value-knicks">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-knicks">
                    <span className="desk-label-knicks">PLAYOFFS</span>
                    <span className="desk-value-knicks">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-knicks highlight-championship-knicks">
                    <span className="desk-label-knicks">BEST RESULT</span>
                    <span className="desk-value-knicks">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-knicks">
            <div className="color-dot-knicks blue-dark-knicks"></div>
            <div className="color-dot-knicks blue-knicks"></div>
            <div className="color-dot-knicks orange-knicks"></div>
            <div className="color-dot-knicks silver-knicks"></div>
            <div className="color-dot-knicks white-knicks"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadKnicksInfoDesk;