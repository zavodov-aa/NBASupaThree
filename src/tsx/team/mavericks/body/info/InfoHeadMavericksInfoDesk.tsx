import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./mavericksInfoDesk.css";

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

const InfoHeadMavericksInfoDesk = () => {
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
          .eq("team_name", "Mavericks")
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
      .channel("hand-mavericks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Mavericks",
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
    return <div className="loading-text">Loading Mavericks Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="mavericks-containers">
      <div className="header-content-mavericks">
        <h1 className="header-title-mavericks">INFO DESK</h1>
      </div>

      <div className="table-containersss-mavericks desk-card-wrapper-mavericks">
        <div className="mavericks-desk-card">
          <div className="desk-accent-top-mavericks"></div>

          <div className="desk-sections-horizontal-mavericks">
            {/* Financial Overview Section */}
            <div className="desk-section-mavericks">
              <div className="desk-header-mavericks">
                <div className="desk-title-icon-mavericks"></div>
                <h3 className="desk-title-mavericks">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-mavericks">
                <div className="desk-items-vertical-mavericks">
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">SALARY CAP</span>
                    <span className="desk-value-mavericks">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">CAP HIT</span>
                    <span className="desk-value-mavericks">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-mavericks highlight-positive-mavericks">
                    <span className="desk-label-mavericks">CAP SPACE</span>
                    <span className="desk-value-mavericks">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">CASH MONEY</span>
                    <span className="desk-value-mavericks">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">STANDINGS</span>
                    <span className="desk-value-mavericks">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-mavericks highlight-negative-mavericks">
                    <span className="desk-label-mavericks">PENALTIES</span>
                    <span className="desk-value-mavericks">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-mavericks">
              <div className="desk-header-mavericks">
                <div className="desk-title-icon-mavericks"></div>
                <h3 className="desk-title-mavericks">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-mavericks">
                <div className="desk-items-vertical-mavericks">
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">ACTIVE ROSTER</span>
                    <span className="desk-value-mavericks">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">DEAD CAP</span>
                    <span className="desk-value-mavericks">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">G LEAGUE</span>
                    <span className="desk-value-mavericks">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">EXTRA POS</span>
                    <span className="desk-value-mavericks">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-mavericks highlight-playoffs-mavericks">
                    <span className="desk-label-mavericks">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-mavericks">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-mavericks">
              <div className="desk-header-mavericks">
                <div className="desk-title-icon-mavericks"></div>
                <h3 className="desk-title-mavericks">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-mavericks">
                <div className="desk-items-vertical-mavericks">
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">IN TEAM SINCE</span>
                    <span className="desk-value-mavericks">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-mavericks highlight-championship-mavericks">
                    <span className="desk-label-mavericks">CHAMPIONSHIPS</span>
                    <span className="desk-value-mavericks">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">REGULAR BEST</span>
                    <span className="desk-value-mavericks">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">
                      DIVISION WINNER
                    </span>
                    <span className="desk-value-mavericks">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-mavericks">
                    <span className="desk-label-mavericks">PLAYOFFS</span>
                    <span className="desk-value-mavericks">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-mavericks highlight-championship-mavericks">
                    <span className="desk-label-mavericks">BEST RESULT</span>
                    <span className="desk-value-mavericks">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-mavericks">
            <div className="color-dot-mavericks blue-dark-mavericks"></div>
            <div className="color-dot-mavericks blue-mavericks"></div>
            <div className="color-dot-mavericks silver-mavericks"></div>
            <div className="color-dot-mavericks navy-mavericks"></div>
            <div className="color-dot-mavericks royal-blue-mavericks"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadMavericksInfoDesk;
