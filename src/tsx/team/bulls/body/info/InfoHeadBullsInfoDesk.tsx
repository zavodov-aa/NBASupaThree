import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./bullsInfoDesk.css";

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

const InfoHeadBullsInfoDesk = () => {
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
          .eq("team_name", "Bulls")
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
      .channel("hand-bulls-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Bulls",
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
    return <div className="loading-text">Loading Bulls Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="bulls-containers">
      <div className="header-content-bulls">
        <h1 className="header-title-bulls">INFO DESK</h1>
      </div>

      <div className="table-containersss-bulls desk-card-wrapper-bulls">
        <div className="bulls-desk-card">
          <div className="desk-accent-top-bulls"></div>

          <div className="desk-sections-horizontal-bulls">
            {/* Financial Overview Section */}
            <div className="desk-section-bulls">
              <div className="desk-header-bulls">
                <div className="desk-title-icon-bulls"></div>
                <h3 className="desk-title-bulls">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-bulls">
                <div className="desk-items-vertical-bulls">
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">SALARY CAP</span>
                    <span className="desk-value-bulls">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">CAP HIT</span>
                    <span className="desk-value-bulls">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-bulls highlight-positive-bulls">
                    <span className="desk-label-bulls">CAP SPACE</span>
                    <span className="desk-value-bulls">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">CASH MONEY</span>
                    <span className="desk-value-bulls">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">STANDINGS</span>
                    <span className="desk-value-bulls">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-bulls highlight-negative-bulls">
                    <span className="desk-label-bulls">PENALTIES</span>
                    <span className="desk-value-bulls">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-bulls">
              <div className="desk-header-bulls">
                <div className="desk-title-icon-bulls"></div>
                <h3 className="desk-title-bulls">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-bulls">
                <div className="desk-items-vertical-bulls">
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">ACTIVE ROSTER</span>
                    <span className="desk-value-bulls">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">DEAD CAP</span>
                    <span className="desk-value-bulls">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">G LEAGUE</span>
                    <span className="desk-value-bulls">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">EXTRA POS</span>
                    <span className="desk-value-bulls">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-bulls highlight-playoffs-bulls">
                    <span className="desk-label-bulls">LAST SEASON RESULT</span>
                    <span className="desk-value-bulls">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-bulls">
              <div className="desk-header-bulls">
                <div className="desk-title-icon-bulls"></div>
                <h3 className="desk-title-bulls">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-bulls">
                <div className="desk-items-vertical-bulls">
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">IN TEAM SINCE</span>
                    <span className="desk-value-bulls">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-bulls highlight-championship-bulls">
                    <span className="desk-label-bulls">CHAMPIONSHIPS</span>
                    <span className="desk-value-bulls">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">REGULAR BEST</span>
                    <span className="desk-value-bulls">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">DIVISION WINNER</span>
                    <span className="desk-value-bulls">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-bulls">
                    <span className="desk-label-bulls">PLAYOFFS</span>
                    <span className="desk-value-bulls">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-bulls highlight-championship-bulls">
                    <span className="desk-label-bulls">BEST RESULT</span>
                    <span className="desk-value-bulls">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-bulls">
            <div className="color-dot-bulls red-dark-bulls"></div>
            <div className="color-dot-bulls red-bulls"></div>
            <div className="color-dot-bulls red-light-bulls"></div>
            <div className="color-dot-bulls black-bulls"></div>
            <div className="color-dot-bulls black-light-bulls"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBullsInfoDesk;
