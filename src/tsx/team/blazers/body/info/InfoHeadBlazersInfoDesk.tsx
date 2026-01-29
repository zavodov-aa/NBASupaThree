import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./blazersInfoDesk.css";

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

const InfoHeadBlazersInfoDesk = () => {
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
          .eq("team_name", "Blazers")
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
      .channel("hand-blazers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Blazers",
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
    return <div className="loading-text">Loading Blazers Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="blazers-containers">
      <div className="header-content-blazers">
        <h1 className="header-title-blazers">INFO DESK</h1>
      </div>

      <div className="table-containersss-blazers desk-card-wrapper-blazers">
        <div className="blazers-desk-card">
          <div className="desk-accent-top-blazers"></div>

          <div className="desk-sections-horizontal-blazers">
            {/* Financial Overview Section */}
            <div className="desk-section-blazers">
              <div className="desk-header-blazers">
                <div className="desk-title-icon-blazers"></div>
                <h3 className="desk-title-blazers">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-blazers">
                <div className="desk-items-vertical-blazers">
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">SALARY CAP</span>
                    <span className="desk-value-blazers">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">CAP HIT</span>
                    <span className="desk-value-blazers">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-blazers highlight-positive-blazers">
                    <span className="desk-label-blazers">CAP SPACE</span>
                    <span className="desk-value-blazers">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">CASH MONEY</span>
                    <span className="desk-value-blazers">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">STANDINGS</span>
                    <span className="desk-value-blazers">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-blazers highlight-negative-blazers">
                    <span className="desk-label-blazers">PENALTIES</span>
                    <span className="desk-value-blazers">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-blazers">
              <div className="desk-header-blazers">
                <div className="desk-title-icon-blazers"></div>
                <h3 className="desk-title-blazers">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-blazers">
                <div className="desk-items-vertical-blazers">
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">ACTIVE ROSTER</span>
                    <span className="desk-value-blazers">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">DEAD CAP</span>
                    <span className="desk-value-blazers">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">G LEAGUE</span>
                    <span className="desk-value-blazers">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">EXTRA POS</span>
                    <span className="desk-value-blazers">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-blazers highlight-playoffs-blazers">
                    <span className="desk-label-blazers">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-blazers">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-blazers">
              <div className="desk-header-blazers">
                <div className="desk-title-icon-blazers"></div>
                <h3 className="desk-title-blazers">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-blazers">
                <div className="desk-items-vertical-blazers">
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">IN TEAM SINCE</span>
                    <span className="desk-value-blazers">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-blazers highlight-championship-blazers">
                    <span className="desk-label-blazers">CHAMPIONSHIPS</span>
                    <span className="desk-value-blazers">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">REGULAR BEST</span>
                    <span className="desk-value-blazers">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">DIVISION WINNER</span>
                    <span className="desk-value-blazers">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-blazers">
                    <span className="desk-label-blazers">PLAYOFFS</span>
                    <span className="desk-value-blazers">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-blazers highlight-championship-blazers">
                    <span className="desk-label-blazers">BEST RESULT</span>
                    <span className="desk-value-blazers">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-blazers">
            <div className="color-dot-blazers black-blazers"></div>
            <div className="color-dot-blazers red-dark-blazers"></div>
            <div className="color-dot-blazers red-blazers"></div>
            <div className="color-dot-blazers silver-blazers"></div>
            <div className="color-dot-blazers white-blazers"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBlazersInfoDesk;
