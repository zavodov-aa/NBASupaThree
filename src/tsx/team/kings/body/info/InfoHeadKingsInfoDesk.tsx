import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./kingsInfoDesk.css";

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

const InfoHeadKingsInfoDesk = () => {
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
          .eq("team_name", "Kings")
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
      .channel("hand-kings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Kings",
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
    return <div className="loading-text">Loading Kings Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="kings-containers">
      <div className="header-content-kings">
        <h1 className="header-title-kings">INFO DESK</h1>
      </div>

      <div className="table-containersss-kings desk-card-wrapper-kings">
        <div className="kings-desk-card">
          <div className="desk-accent-top-kings"></div>

          <div className="desk-sections-horizontal-kings">
            {/* Financial Overview Section */}
            <div className="desk-section-kings">
              <div className="desk-header-kings">
                <div className="desk-title-icon-kings"></div>
                <h3 className="desk-title-kings">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-kings">
                <div className="desk-items-vertical-kings">
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">SALARY CAP</span>
                    <span className="desk-value-kings">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">CAP HIT</span>
                    <span className="desk-value-kings">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-kings highlight-positive-kings">
                    <span className="desk-label-kings">CAP SPACE</span>
                    <span className="desk-value-kings">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">CASH MONEY</span>
                    <span className="desk-value-kings">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">STANDINGS</span>
                    <span className="desk-value-kings">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-kings highlight-negative-kings">
                    <span className="desk-label-kings">PENALTIES</span>
                    <span className="desk-value-kings">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-kings">
              <div className="desk-header-kings">
                <div className="desk-title-icon-kings"></div>
                <h3 className="desk-title-kings">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-kings">
                <div className="desk-items-vertical-kings">
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">ACTIVE ROSTER</span>
                    <span className="desk-value-kings">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">DEAD CAP</span>
                    <span className="desk-value-kings">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">G LEAGUE</span>
                    <span className="desk-value-kings">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">EXTRA POS</span>
                    <span className="desk-value-kings">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-kings highlight-playoffs-kings">
                    <span className="desk-label-kings">LAST SEASON RESULT</span>
                    <span className="desk-value-kings">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-kings">
              <div className="desk-header-kings">
                <div className="desk-title-icon-kings"></div>
                <h3 className="desk-title-kings">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-kings">
                <div className="desk-items-vertical-kings">
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">IN TEAM SINCE</span>
                    <span className="desk-value-kings">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-kings highlight-championship-kings">
                    <span className="desk-label-kings">CHAMPIONSHIPS</span>
                    <span className="desk-value-kings">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">REGULAR BEST</span>
                    <span className="desk-value-kings">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">DIVISION WINNER</span>
                    <span className="desk-value-kings">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-kings">
                    <span className="desk-label-kings">PLAYOFFS</span>
                    <span className="desk-value-kings">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-kings highlight-championship-kings">
                    <span className="desk-label-kings">BEST RESULT</span>
                    <span className="desk-value-kings">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-kings">
            <div className="color-dot-kings purple-dark-kings"></div>
            <div className="color-dot-kings purple-kings"></div>
            <div className="color-dot-kings purple-light-kings"></div>
            <div className="color-dot-kings gold-kings"></div>
            <div className="color-dot-kings gold-light-kings"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadKingsInfoDesk;