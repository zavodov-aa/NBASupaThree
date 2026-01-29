import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./grizzliesInfoDesk.css";

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

const InfoHeadGrizzliesInfoDesk = () => {
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
          .eq("team_name", "Grizzlies")
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
      .channel("hand-grizzlies-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Grizzlies",
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
    return <div className="loading-text">Loading Grizzlies Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="grizzlies-containers">
      <div className="header-content-grizzlies">
        <h1 className="header-title-grizzlies">INFO DESK</h1>
      </div>

      <div className="table-containersss-grizzlies desk-card-wrapper-grizzlies">
        <div className="grizzlies-desk-card">
          <div className="desk-accent-top-grizzlies"></div>

          <div className="desk-sections-horizontal-grizzlies">
            {/* Financial Overview Section */}
            <div className="desk-section-grizzlies">
              <div className="desk-header-grizzlies">
                <div className="desk-title-icon-grizzlies"></div>
                <h3 className="desk-title-grizzlies">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-grizzlies">
                <div className="desk-items-vertical-grizzlies">
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">SALARY CAP</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">CAP HIT</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies highlight-positive-grizzlies">
                    <span className="desk-label-grizzlies">CAP SPACE</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">CASH MONEY</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">STANDINGS</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies highlight-negative-grizzlies">
                    <span className="desk-label-grizzlies">PENALTIES</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-grizzlies">
              <div className="desk-header-grizzlies">
                <div className="desk-title-icon-grizzlies"></div>
                <h3 className="desk-title-grizzlies">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-grizzlies">
                <div className="desk-items-vertical-grizzlies">
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">ACTIVE ROSTER</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">DEAD CAP</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">G LEAGUE</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">EXTRA POS</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies highlight-playoffs-grizzlies">
                    <span className="desk-label-grizzlies">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-grizzlies">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-grizzlies">
              <div className="desk-header-grizzlies">
                <div className="desk-title-icon-grizzlies"></div>
                <h3 className="desk-title-grizzlies">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-grizzlies">
                <div className="desk-items-vertical-grizzlies">
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">IN TEAM SINCE</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies highlight-championship-grizzlies">
                    <span className="desk-label-grizzlies">CHAMPIONSHIPS</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">REGULAR BEST</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">
                      DIVISION WINNER
                    </span>
                    <span className="desk-value-grizzlies">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies">
                    <span className="desk-label-grizzlies">PLAYOFFS</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-grizzlies highlight-championship-grizzlies">
                    <span className="desk-label-grizzlies">BEST RESULT</span>
                    <span className="desk-value-grizzlies">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-grizzlies">
            <div className="color-dot-grizzlies navy-grizzlies"></div>
            <div className="color-dot-grizzlies blue-grizzlies"></div>
            <div className="color-dot-grizzlies light-blue-grizzlies"></div>
            <div className="color-dot-grizzlies yellow-grizzlies"></div>
            <div className="color-dot-grizzlies gold-grizzlies"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadGrizzliesInfoDesk;
