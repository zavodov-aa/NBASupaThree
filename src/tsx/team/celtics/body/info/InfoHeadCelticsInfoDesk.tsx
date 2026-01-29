import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./celticsInfoDesk.css";

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

const InfoHeadCelticsInfoDesk = () => {
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
          .eq("team_name", "Celtics")
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
      .channel("hand-celtics-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Celtics",
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
    return <div className="loading-text">Loading Celtics Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="celtics-containers">
      <div className="header-content-celtics">
        <h1 className="header-title-celtics">INFO DESK</h1>
      </div>

      <div className="table-containersss-celtics desk-card-wrapper-celtics">
        <div className="celtics-desk-card">
          <div className="desk-accent-top-celtics"></div>

          <div className="desk-sections-horizontal-celtics">
            {/* Financial Overview Section */}
            <div className="desk-section-celtics">
              <div className="desk-header-celtics">
                <div className="desk-title-icon-celtics"></div>
                <h3 className="desk-title-celtics">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-celtics">
                <div className="desk-items-vertical-celtics">
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">SALARY CAP</span>
                    <span className="desk-value-celtics">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">CAP HIT</span>
                    <span className="desk-value-celtics">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-celtics highlight-positive-celtics">
                    <span className="desk-label-celtics">CAP SPACE</span>
                    <span className="desk-value-celtics">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">CASH MONEY</span>
                    <span className="desk-value-celtics">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">STANDINGS</span>
                    <span className="desk-value-celtics">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-celtics highlight-negative-celtics">
                    <span className="desk-label-celtics">PENALTIES</span>
                    <span className="desk-value-celtics">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-celtics">
              <div className="desk-header-celtics">
                <div className="desk-title-icon-celtics"></div>
                <h3 className="desk-title-celtics">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-celtics">
                <div className="desk-items-vertical-celtics">
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">ACTIVE ROSTER</span>
                    <span className="desk-value-celtics">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">DEAD CAP</span>
                    <span className="desk-value-celtics">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">G LEAGUE</span>
                    <span className="desk-value-celtics">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">EXTRA POS</span>
                    <span className="desk-value-celtics">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-celtics highlight-playoffs-celtics">
                    <span className="desk-label-celtics">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-celtics">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-celtics">
              <div className="desk-header-celtics">
                <div className="desk-title-icon-celtics"></div>
                <h3 className="desk-title-celtics">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-celtics">
                <div className="desk-items-vertical-celtics">
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">IN TEAM SINCE</span>
                    <span className="desk-value-celtics">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-celtics highlight-championship-celtics">
                    <span className="desk-label-celtics">CHAMPIONSHIPS</span>
                    <span className="desk-value-celtics">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">REGULAR BEST</span>
                    <span className="desk-value-celtics">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">DIVISION WINNER</span>
                    <span className="desk-value-celtics">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-celtics">
                    <span className="desk-label-celtics">PLAYOFFS</span>
                    <span className="desk-value-celtics">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-celtics highlight-championship-celtics">
                    <span className="desk-label-celtics">BEST RESULT</span>
                    <span className="desk-value-celtics">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-celtics">
            <div className="color-dot-celtics purple-dark-celtics"></div>
            <div className="color-dot-celtics purple-celtics"></div>
            <div className="color-dot-celtics purple-light-celtics"></div>
            <div className="color-dot-celtics gold-celtics"></div>
            <div className="color-dot-celtics gold-light-celtics"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadCelticsInfoDesk;
