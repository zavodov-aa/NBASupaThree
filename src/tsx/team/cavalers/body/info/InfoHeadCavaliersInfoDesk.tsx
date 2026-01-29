import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./cavaliersInfoDesk.css";

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

const InfoHeadCavaliersInfoDesk = () => {
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
          .eq("team_name", "Cavaliers")
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
      .channel("hand-cavaliers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Cavaliers",
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
    return <div className="loading-text">Loading Cavaliers Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="cavaliers-containers">
      <div className="header-content-cavaliers">
        <h1 className="header-title-cavaliers">INFO DESK</h1>
      </div>

      <div className="table-containersss-cavaliers desk-card-wrapper-cavaliers">
        <div className="cavaliers-desk-card">
          <div className="desk-accent-top-cavaliers"></div>

          <div className="desk-sections-horizontal-cavaliers">
            {/* Financial Overview Section */}
            <div className="desk-section-cavaliers">
              <div className="desk-header-cavaliers">
                <div className="desk-title-icon-cavaliers"></div>
                <h3 className="desk-title-cavaliers">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-cavaliers">
                <div className="desk-items-vertical-cavaliers">
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">SALARY CAP</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">CAP HIT</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers highlight-positive-cavaliers">
                    <span className="desk-label-cavaliers">CAP SPACE</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">CASH MONEY</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">STANDINGS</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers highlight-negative-cavaliers">
                    <span className="desk-label-cavaliers">PENALTIES</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-cavaliers">
              <div className="desk-header-cavaliers">
                <div className="desk-title-icon-cavaliers"></div>
                <h3 className="desk-title-cavaliers">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-cavaliers">
                <div className="desk-items-vertical-cavaliers">
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">ACTIVE ROSTER</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">DEAD CAP</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">G LEAGUE</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">EXTRA POS</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers highlight-playoffs-cavaliers">
                    <span className="desk-label-cavaliers">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-cavaliers">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-cavaliers">
              <div className="desk-header-cavaliers">
                <div className="desk-title-icon-cavaliers"></div>
                <h3 className="desk-title-cavaliers">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-cavaliers">
                <div className="desk-items-vertical-cavaliers">
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">IN TEAM SINCE</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers highlight-championship-cavaliers">
                    <span className="desk-label-cavaliers">CHAMPIONSHIPS</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">REGULAR BEST</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">
                      DIVISION WINNER
                    </span>
                    <span className="desk-value-cavaliers">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers">
                    <span className="desk-label-cavaliers">PLAYOFFS</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-cavaliers highlight-championship-cavaliers">
                    <span className="desk-label-cavaliers">BEST RESULT</span>
                    <span className="desk-value-cavaliers">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-cavaliers">
            <div className="color-dot-cavaliers burgundy-dark-cavaliers"></div>
            <div className="color-dot-cavaliers burgundy-cavaliers"></div>
            <div className="color-dot-cavaliers navy-blue-cavaliers"></div>
            <div className="color-dot-cavaliers gold-cavaliers"></div>
            <div className="color-dot-cavaliers gold-light-cavaliers"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadCavaliersInfoDesk;
