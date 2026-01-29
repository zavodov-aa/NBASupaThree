import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./hawksInfoDesk.css";

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

const InfoHeadHawksInfoDesk = () => {
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
          .eq("team_name", "Hawks")
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
      .channel("hand-hawks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Hawks",
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
    return <div className="loading-text">Loading Hawks Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="hawks-containers">
      <div className="header-content-hawks">
        <h1 className="header-title-hawks">INFO DESK</h1>
      </div>

      <div className="table-containersss-hawks desk-card-wrapper-hawks">
        <div className="hawks-desk-card">
          <div className="desk-accent-top-hawks"></div>

          <div className="desk-sections-horizontal-hawks">
            {/* Financial Overview Section */}
            <div className="desk-section-hawks">
              <div className="desk-header-hawks">
                <div className="desk-title-icon-hawks"></div>
                <h3 className="desk-title-hawks">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-hawks">
                <div className="desk-items-vertical-hawks">
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">SALARY CAP</span>
                    <span className="desk-value-hawks">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">CAP HIT</span>
                    <span className="desk-value-hawks">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-hawks highlight-positive-hawks">
                    <span className="desk-label-hawks">CAP SPACE</span>
                    <span className="desk-value-hawks">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">CASH MONEY</span>
                    <span className="desk-value-hawks">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">STANDINGS</span>
                    <span className="desk-value-hawks">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-hawks highlight-negative-hawks">
                    <span className="desk-label-hawks">PENALTIES</span>
                    <span className="desk-value-hawks">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-hawks">
              <div className="desk-header-hawks">
                <div className="desk-title-icon-hawks"></div>
                <h3 className="desk-title-hawks">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-hawks">
                <div className="desk-items-vertical-hawks">
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">ACTIVE ROSTER</span>
                    <span className="desk-value-hawks">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">DEAD CAP</span>
                    <span className="desk-value-hawks">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">G LEAGUE</span>
                    <span className="desk-value-hawks">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">EXTRA POS</span>
                    <span className="desk-value-hawks">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-hawks highlight-playoffs-hawks">
                    <span className="desk-label-hawks">LAST SEASON RESULT</span>
                    <span className="desk-value-hawks">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-hawks">
              <div className="desk-header-hawks">
                <div className="desk-title-icon-hawks"></div>
                <h3 className="desk-title-hawks">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-hawks">
                <div className="desk-items-vertical-hawks">
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">IN TEAM SINCE</span>
                    <span className="desk-value-hawks">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-hawks highlight-championship-hawks">
                    <span className="desk-label-hawks">CHAMPIONSHIPS</span>
                    <span className="desk-value-hawks">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">REGULAR BEST</span>
                    <span className="desk-value-hawks">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">DIVISION WINNER</span>
                    <span className="desk-value-hawks">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-hawks">
                    <span className="desk-label-hawks">PLAYOFFS</span>
                    <span className="desk-value-hawks">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-hawks highlight-championship-hawks">
                    <span className="desk-label-hawks">BEST RESULT</span>
                    <span className="desk-value-hawks">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-hawks">
            <div className="color-dot-hawks purple-dark-hawks"></div>
            <div className="color-dot-hawks purple-hawks"></div>
            <div className="color-dot-hawks purple-light-hawks"></div>
            <div className="color-dot-hawks gold-hawks"></div>
            <div className="color-dot-hawks gold-light-hawks"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksInfoDesk;
