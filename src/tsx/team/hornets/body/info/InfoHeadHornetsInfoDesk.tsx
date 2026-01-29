import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./hornetsInfoDesk.css";

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

const InfoHeadHornetsInfoDesk = () => {
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
          .eq("team_name", "Hornets")
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
      .channel("hand-hornets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Hornets",
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
    return <div className="loading-text">Loading Hornets Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="hornets-containers">
      <div className="header-content-hornets">
        <h1 className="header-title-hornets">INFO DESK</h1>
      </div>

      <div className="table-containersss-hornets desk-card-wrapper-hornets">
        <div className="hornets-desk-card">
          <div className="desk-accent-top-hornets"></div>

          <div className="desk-sections-horizontal-hornets">
            {/* Financial Overview Section */}
            <div className="desk-section-hornets">
              <div className="desk-header-hornets">
                <div className="desk-title-icon-hornets"></div>
                <h3 className="desk-title-hornets">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-hornets">
                <div className="desk-items-vertical-hornets">
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">SALARY CAP</span>
                    <span className="desk-value-hornets">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">CAP HIT</span>
                    <span className="desk-value-hornets">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-hornets highlight-positive-hornets">
                    <span className="desk-label-hornets">CAP SPACE</span>
                    <span className="desk-value-hornets">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">CASH MONEY</span>
                    <span className="desk-value-hornets">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">STANDINGS</span>
                    <span className="desk-value-hornets">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-hornets highlight-negative-hornets">
                    <span className="desk-label-hornets">PENALTIES</span>
                    <span className="desk-value-hornets">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-hornets">
              <div className="desk-header-hornets">
                <div className="desk-title-icon-hornets"></div>
                <h3 className="desk-title-hornets">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-hornets">
                <div className="desk-items-vertical-hornets">
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">ACTIVE ROSTER</span>
                    <span className="desk-value-hornets">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">DEAD CAP</span>
                    <span className="desk-value-hornets">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">G LEAGUE</span>
                    <span className="desk-value-hornets">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">EXTRA POS</span>
                    <span className="desk-value-hornets">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-hornets highlight-playoffs-hornets">
                    <span className="desk-label-hornets">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-hornets">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-hornets">
              <div className="desk-header-hornets">
                <div className="desk-title-icon-hornets"></div>
                <h3 className="desk-title-hornets">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-hornets">
                <div className="desk-items-vertical-hornets">
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">IN TEAM SINCE</span>
                    <span className="desk-value-hornets">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-hornets highlight-championship-hornets">
                    <span className="desk-label-hornets">CHAMPIONSHIPS</span>
                    <span className="desk-value-hornets">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">REGULAR BEST</span>
                    <span className="desk-value-hornets">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">DIVISION WINNER</span>
                    <span className="desk-value-hornets">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-hornets">
                    <span className="desk-label-hornets">PLAYOFFS</span>
                    <span className="desk-value-hornets">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-hornets highlight-championship-hornets">
                    <span className="desk-label-hornets">BEST RESULT</span>
                    <span className="desk-value-hornets">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-hornets">
            <div className="color-dot-hornets teal-hornets"></div>
            <div className="color-dot-hornets purple-dark-hornets"></div>
            <div className="color-dot-hornets purple-hornets"></div>
            <div className="color-dot-hornets blue-hornets"></div>
            <div className="color-dot-hornets gray-hornets"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHornetsInfoDesk;
