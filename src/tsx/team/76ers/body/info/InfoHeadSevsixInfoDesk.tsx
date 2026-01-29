import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./sevsixInfoDesk.css";

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
          .eq("team_name", "76ers")
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
      .channel("hand-sevsix-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.76ers",
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
    return <div className="loading-text">Loading 76ers Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="sevsix-containers">
      <div className="header-content-sevsix">
        <h1 className="header-title-sevsix">INFO DESK</h1>
      </div>

      <div className="table-containersss-sevsix desk-card-wrapper-sevsix">
        <div className="sevsix-desk-card">
          <div className="desk-accent-top-sevsix"></div>

          <div className="desk-sections-horizontal-sevsix">
            {/* Financial Overview Section */}
            <div className="desk-section-sevsix">
              <div className="desk-header-sevsix">
                <div className="desk-title-icon-sevsix"></div>
                <h3 className="desk-title-sevsix">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-sevsix">
                <div className="desk-items-vertical-sevsix">
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">SALARY CAP</span>
                    <span className="desk-value-sevsix">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">CAP HIT</span>
                    <span className="desk-value-sevsix">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-sevsix highlight-positive-sevsix">
                    <span className="desk-label-sevsix">CAP SPACE</span>
                    <span className="desk-value-sevsix">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">CASH MONEY</span>
                    <span className="desk-value-sevsix">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">STANDINGS</span>
                    <span className="desk-value-sevsix">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-sevsix highlight-negative-sevsix">
                    <span className="desk-label-sevsix">PENALTIES</span>
                    <span className="desk-value-sevsix">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-sevsix">
              <div className="desk-header-sevsix">
                <div className="desk-title-icon-sevsix"></div>
                <h3 className="desk-title-sevsix">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-sevsix">
                <div className="desk-items-vertical-sevsix">
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">ACTIVE ROSTER</span>
                    <span className="desk-value-sevsix">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">DEAD CAP</span>
                    <span className="desk-value-sevsix">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">G LEAGUE</span>
                    <span className="desk-value-sevsix">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">EXTRA POS</span>
                    <span className="desk-value-sevsix">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-sevsix highlight-playoffs-sevsix">
                    <span className="desk-label-sevsix">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-sevsix">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-sevsix">
              <div className="desk-header-sevsix">
                <div className="desk-title-icon-sevsix"></div>
                <h3 className="desk-title-sevsix">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-sevsix">
                <div className="desk-items-vertical-sevsix">
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">IN TEAM SINCE</span>
                    <span className="desk-value-sevsix">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-sevsix highlight-championship-sevsix">
                    <span className="desk-label-sevsix">CHAMPIONSHIPS</span>
                    <span className="desk-value-sevsix">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">REGULAR BEST</span>
                    <span className="desk-value-sevsix">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">DIVISION WINNER</span>
                    <span className="desk-value-sevsix">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-sevsix">
                    <span className="desk-label-sevsix">PLAYOFFS</span>
                    <span className="desk-value-sevsix">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-sevsix highlight-championship-sevsix">
                    <span className="desk-label-sevsix">BEST RESULT</span>
                    <span className="desk-value-sevsix">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-sevsix">
            <div className="color-dot-sevsix blue-dark-sevsix"></div>
            <div className="color-dot-sevsix blue-sevsix"></div>
            <div className="color-dot-sevsix red-sevsix"></div>
            <div className="color-dot-sevsix royal-blue-sevsix"></div>
            <div className="color-dot-sevsix silver-sevsix"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksInfoDesk;
