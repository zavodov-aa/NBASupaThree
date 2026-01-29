import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./spursInfoDesk.css";

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

const InfoHeadSpursInfoDesk = () => {
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
          .eq("team_name", "Spurs")
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
      .channel("hand-spurs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Spurs",
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
    return <div className="loading-text">Loading Spurs Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="spurs-containers">
      <div className="header-content-spurs">
        <h1 className="header-title-spurs">INFO DESK</h1>
      </div>

      <div className="table-containersss-spurs desk-card-wrapper-spurs">
        <div className="spurs-desk-card">
          <div className="desk-accent-top-spurs"></div>

          <div className="desk-sections-horizontal-spurs">
            {/* Financial Overview Section */}
            <div className="desk-section-spurs">
              <div className="desk-header-spurs">
                <div className="desk-title-icon-spurs"></div>
                <h3 className="desk-title-spurs">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-spurs">
                <div className="desk-items-vertical-spurs">
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">SALARY CAP</span>
                    <span className="desk-value-spurs">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">CAP HIT</span>
                    <span className="desk-value-spurs">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-spurs highlight-positive-spurs">
                    <span className="desk-label-spurs">CAP SPACE</span>
                    <span className="desk-value-spurs">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">CASH MONEY</span>
                    <span className="desk-value-spurs">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">STANDINGS</span>
                    <span className="desk-value-spurs">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-spurs highlight-negative-spurs">
                    <span className="desk-label-spurs">PENALTIES</span>
                    <span className="desk-value-spurs">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-spurs">
              <div className="desk-header-spurs">
                <div className="desk-title-icon-spurs"></div>
                <h3 className="desk-title-spurs">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-spurs">
                <div className="desk-items-vertical-spurs">
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">ACTIVE ROSTER</span>
                    <span className="desk-value-spurs">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">DEAD CAP</span>
                    <span className="desk-value-spurs">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">G LEAGUE</span>
                    <span className="desk-value-spurs">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">EXTRA POS</span>
                    <span className="desk-value-spurs">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-spurs highlight-playoffs-spurs">
                    <span className="desk-label-spurs">LAST SEASON RESULT</span>
                    <span className="desk-value-spurs">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-spurs">
              <div className="desk-header-spurs">
                <div className="desk-title-icon-spurs"></div>
                <h3 className="desk-title-spurs">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-spurs">
                <div className="desk-items-vertical-spurs">
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">IN TEAM SINCE</span>
                    <span className="desk-value-spurs">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-spurs highlight-championship-spurs">
                    <span className="desk-label-spurs">CHAMPIONSHIPS</span>
                    <span className="desk-value-spurs">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">REGULAR BEST</span>
                    <span className="desk-value-spurs">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">DIVISION WINNER</span>
                    <span className="desk-value-spurs">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-spurs">
                    <span className="desk-label-spurs">PLAYOFFS</span>
                    <span className="desk-value-spurs">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-spurs highlight-championship-spurs">
                    <span className="desk-label-spurs">BEST RESULT</span>
                    <span className="desk-value-spurs">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-spurs">
            <div className="color-dot-spurs black-spurs"></div>
            <div className="color-dot-spurs silver-dark-spurs"></div>
            <div className="color-dot-spurs silver-spurs"></div>
            <div className="color-dot-spurs silver-light-spurs"></div>
            <div className="color-dot-spurs white-spurs"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSpursInfoDesk;