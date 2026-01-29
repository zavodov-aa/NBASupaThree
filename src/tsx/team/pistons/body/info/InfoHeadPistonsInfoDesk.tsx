import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./pistonsInfoDesk.css";

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

const InfoHeadPistonsInfoDesk = () => {
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
          .eq("team_name", "Pistons")
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
      .channel("hand-pistons-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pistons",
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
    return <div className="loading-text">Loading Pistons Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="pistons-containers">
      <div className="header-content-pistons">
        <h1 className="header-title-pistons">INFO DESK</h1>
      </div>

      <div className="table-containersss-pistons desk-card-wrapper-pistons">
        <div className="pistons-desk-card">
          <div className="desk-accent-top-pistons"></div>

          <div className="desk-sections-horizontal-pistons">
            {/* Financial Overview Section */}
            <div className="desk-section-pistons">
              <div className="desk-header-pistons">
                <div className="desk-title-icon-pistons"></div>
                <h3 className="desk-title-pistons">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-pistons">
                <div className="desk-items-vertical-pistons">
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">SALARY CAP</span>
                    <span className="desk-value-pistons">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">CAP HIT</span>
                    <span className="desk-value-pistons">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-pistons highlight-positive-pistons">
                    <span className="desk-label-pistons">CAP SPACE</span>
                    <span className="desk-value-pistons">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">CASH MONEY</span>
                    <span className="desk-value-pistons">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">STANDINGS</span>
                    <span className="desk-value-pistons">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-pistons highlight-negative-pistons">
                    <span className="desk-label-pistons">PENALTIES</span>
                    <span className="desk-value-pistons">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-pistons">
              <div className="desk-header-pistons">
                <div className="desk-title-icon-pistons"></div>
                <h3 className="desk-title-pistons">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-pistons">
                <div className="desk-items-vertical-pistons">
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">ACTIVE ROSTER</span>
                    <span className="desk-value-pistons">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">DEAD CAP</span>
                    <span className="desk-value-pistons">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">G LEAGUE</span>
                    <span className="desk-value-pistons">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">EXTRA POS</span>
                    <span className="desk-value-pistons">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-pistons highlight-playoffs-pistons">
                    <span className="desk-label-pistons">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-pistons">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-pistons">
              <div className="desk-header-pistons">
                <div className="desk-title-icon-pistons"></div>
                <h3 className="desk-title-pistons">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-pistons">
                <div className="desk-items-vertical-pistons">
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">IN TEAM SINCE</span>
                    <span className="desk-value-pistons">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-pistons highlight-championship-pistons">
                    <span className="desk-label-pistons">CHAMPIONSHIPS</span>
                    <span className="desk-value-pistons">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">REGULAR BEST</span>
                    <span className="desk-value-pistons">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">DIVISION WINNER</span>
                    <span className="desk-value-pistons">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-pistons">
                    <span className="desk-label-pistons">PLAYOFFS</span>
                    <span className="desk-value-pistons">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-pistons highlight-championship-pistons">
                    <span className="desk-label-pistons">BEST RESULT</span>
                    <span className="desk-value-pistons">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-pistons">
            <div className="color-dot-pistons blue-dark-pistons"></div>
            <div className="color-dot-pistons blue-pistons"></div>
            <div className="color-dot-pistons red-pistons"></div>
            <div className="color-dot-pistons white-pistons"></div>
            <div className="color-dot-pistons silver-pistons"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPistonsInfoDesk;
