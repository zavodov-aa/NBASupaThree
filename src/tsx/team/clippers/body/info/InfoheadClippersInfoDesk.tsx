import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./clippersInfoDesk.css";

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

const InfoHeadClippersInfoDesk = () => {
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
          .eq("team_name", "Clippers")
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
      .channel("hand-clippers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Clippers",
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
    return <div className="loading-text">Loading Clippers Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="clippers-containers">
      <div className="header-content-clippers">
        <h1 className="header-title-clippers">INFO DESK</h1>
      </div>

      <div className="table-containersss-clippers desk-card-wrapper-clippers">
        <div className="clippers-desk-card">
          <div className="desk-accent-top-clippers"></div>

          <div className="desk-sections-horizontal-clippers">
            {/* Financial Overview Section */}
            <div className="desk-section-clippers">
              <div className="desk-header-clippers">
                <div className="desk-title-icon-clippers"></div>
                <h3 className="desk-title-clippers">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-clippers">
                <div className="desk-items-vertical-clippers">
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">SALARY CAP</span>
                    <span className="desk-value-clippers">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">CAP HIT</span>
                    <span className="desk-value-clippers">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-clippers highlight-positive-clippers">
                    <span className="desk-label-clippers">CAP SPACE</span>
                    <span className="desk-value-clippers">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">CASH MONEY</span>
                    <span className="desk-value-clippers">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">STANDINGS</span>
                    <span className="desk-value-clippers">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-clippers highlight-negative-clippers">
                    <span className="desk-label-clippers">PENALTIES</span>
                    <span className="desk-value-clippers">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-clippers">
              <div className="desk-header-clippers">
                <div className="desk-title-icon-clippers"></div>
                <h3 className="desk-title-clippers">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-clippers">
                <div className="desk-items-vertical-clippers">
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">ACTIVE ROSTER</span>
                    <span className="desk-value-clippers">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">DEAD CAP</span>
                    <span className="desk-value-clippers">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">G LEAGUE</span>
                    <span className="desk-value-clippers">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">EXTRA POS</span>
                    <span className="desk-value-clippers">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-clippers highlight-playoffs-clippers">
                    <span className="desk-label-clippers">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-clippers">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-clippers">
              <div className="desk-header-clippers">
                <div className="desk-title-icon-clippers"></div>
                <h3 className="desk-title-clippers">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-clippers">
                <div className="desk-items-vertical-clippers">
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">IN TEAM SINCE</span>
                    <span className="desk-value-clippers">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-clippers highlight-championship-clippers">
                    <span className="desk-label-clippers">CHAMPIONSHIPS</span>
                    <span className="desk-value-clippers">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">REGULAR BEST</span>
                    <span className="desk-value-clippers">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">DIVISION WINNER</span>
                    <span className="desk-value-clippers">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-clippers">
                    <span className="desk-label-clippers">PLAYOFFS</span>
                    <span className="desk-value-clippers">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-clippers highlight-championship-clippers">
                    <span className="desk-label-clippers">BEST RESULT</span>
                    <span className="desk-value-clippers">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-clippers">
            <div className="color-dot-clippers red-dark-clippers"></div>
            <div className="color-dot-clippers blue-clippers"></div>
            <div className="color-dot-clippers red-clippers"></div>
            <div className="color-dot-clippers silver-clippers"></div>
            <div className="color-dot-clippers black-clippers"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadClippersInfoDesk;
