import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./sunsInfoDesk.css";

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

const InfoHeadSunsInfoDesk = () => {
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
          .eq("team_name", "Suns")
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
      .channel("hand-suns-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Suns",
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
    return <div className="loading-text">Loading Suns Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="suns-containers">
      <div className="header-content-suns">
        <h1 className="header-title-suns">INFO DESK</h1>
      </div>

      <div className="table-containersss-suns desk-card-wrapper-suns">
        <div className="suns-desk-card">
          <div className="desk-accent-top-suns"></div>

          <div className="desk-sections-horizontal-suns">
            {/* Financial Overview Section */}
            <div className="desk-section-suns">
              <div className="desk-header-suns">
                <div className="desk-title-icon-suns"></div>
                <h3 className="desk-title-suns">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-suns">
                <div className="desk-items-vertical-suns">
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">SALARY CAP</span>
                    <span className="desk-value-suns">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">CAP HIT</span>
                    <span className="desk-value-suns">{teamData?.cap_hit}</span>
                  </div>
                  <div className="desk-item-suns highlight-positive-suns">
                    <span className="desk-label-suns">CAP SPACE</span>
                    <span className="desk-value-suns">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">CASH MONEY</span>
                    <span className="desk-value-suns">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">STANDINGS</span>
                    <span className="desk-value-suns">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-suns highlight-negative-suns">
                    <span className="desk-label-suns">PENALTIES</span>
                    <span className="desk-value-suns">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-suns">
              <div className="desk-header-suns">
                <div className="desk-title-icon-suns"></div>
                <h3 className="desk-title-suns">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-suns">
                <div className="desk-items-vertical-suns">
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">ACTIVE ROSTER</span>
                    <span className="desk-value-suns">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">DEAD CAP</span>
                    <span className="desk-value-suns">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">G LEAGUE</span>
                    <span className="desk-value-suns">{teamData?.g_leage}</span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">EXTRA POS</span>
                    <span className="desk-value-suns">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-suns highlight-playoffs-suns">
                    <span className="desk-label-suns">LAST SEASON RESULT</span>
                    <span className="desk-value-suns">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-suns">
              <div className="desk-header-suns">
                <div className="desk-title-icon-suns"></div>
                <h3 className="desk-title-suns">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-suns">
                <div className="desk-items-vertical-suns">
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">IN TEAM SINCE</span>
                    <span className="desk-value-suns">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-suns highlight-championship-suns">
                    <span className="desk-label-suns">CHAMPIONSHIPS</span>
                    <span className="desk-value-suns">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">REGULAR BEST</span>
                    <span className="desk-value-suns">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">DIVISION WINNER</span>
                    <span className="desk-value-suns">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-suns">
                    <span className="desk-label-suns">PLAYOFFS</span>
                    <span className="desk-value-suns">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-suns highlight-championship-suns">
                    <span className="desk-label-suns">BEST RESULT</span>
                    <span className="desk-value-suns">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-suns">
            <div className="color-dot-suns purple-dark-suns"></div>
            <div className="color-dot-suns purple-suns"></div>
            <div className="color-dot-suns orange-suns"></div>
            <div className="color-dot-suns orange-light-suns"></div>
            <div className="color-dot-suns yellow-suns"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSunsInfoDesk;
