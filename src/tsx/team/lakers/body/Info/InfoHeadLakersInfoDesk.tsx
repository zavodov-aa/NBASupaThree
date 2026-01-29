import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./lakersInfoDesk.css";

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

const InfoHeadLakersInfoDesk = () => {
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
          .eq("team_name", "Lakers")
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
      .channel("hand-lakers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Lakers",
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
    return <div className="loading-text">Loading Lakers Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="lakers-containers">
      <div className="header-content">
        <h1 className="header-title">LAKERS INFO DESK</h1>
      </div>

      <div className="table-containersss desk-card-wrapper">
        <div className="lakers-desk-card">
          <div className="desk-accent-top"></div>

          <div className="desk-sections-horizontal">
            {/* Financial Overview Section */}
            <div className="desk-section">
              <div className="desk-header">
                <div className="desk-title-icon"></div>
                <h3 className="desk-title">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content">
                <div className="desk-items-vertical">
                  <div className="desk-item">
                    <span className="desk-label">SALARY CAP</span>
                    <span className="desk-value">{teamData?.salary_cap}</span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">CAP HIT</span>
                    <span className="desk-value">{teamData?.cap_hit}</span>
                  </div>
                  <div className="desk-item highlight-positive">
                    <span className="desk-label">CAP SPACE</span>
                    <span className="desk-value">{teamData?.cap_space}</span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">CASH MONEY</span>
                    <span className="desk-value">{teamData?.cash_money}</span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">STANDINGS</span>
                    <span className="desk-value">{teamData?.standing}</span>
                  </div>
                  <div className="desk-item highlight-negative">
                    <span className="desk-label">PENALTIES</span>
                    <span className="desk-value">{teamData?.penalties}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section">
              <div className="desk-header">
                <div className="desk-title-icon"></div>
                <h3 className="desk-title">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content">
                <div className="desk-items-vertical">
                  <div className="desk-item">
                    <span className="desk-label">ACTIVE ROSTER</span>
                    <span className="desk-value">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">DEAD CAP</span>
                    <span className="desk-value">{teamData?.dead_cap}</span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">G LEAGUE</span>
                    <span className="desk-value">{teamData?.g_leage}</span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">EXTRA POS</span>
                    <span className="desk-value">{teamData?.extra_pos}</span>
                  </div>
                  <div className="desk-item highlight-playoffs">
                    <span className="desk-label">LAST SEASON RESULT</span>
                    <span className="desk-value">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section">
              <div className="desk-header">
                <div className="desk-title-icon"></div>
                <h3 className="desk-title">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content">
                <div className="desk-items-vertical">
                  <div className="desk-item">
                    <span className="desk-label">IN TEAM SINCE</span>
                    <span className="desk-value">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item highlight-championship">
                    <span className="desk-label">CHAMPIONSHIPS</span>
                    <span className="desk-value">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">REGULAR BEST</span>
                    <span className="desk-value">{teamData?.regular_best}</span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">DIVISION WINNER</span>
                    <span className="desk-value">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item">
                    <span className="desk-label">PLAYOFFS</span>
                    <span className="desk-value">{teamData?.playoffs}</span>
                  </div>
                  <div className="desk-item highlight-championship">
                    <span className="desk-label">BEST RESULT</span>
                    <span className="desk-value">{teamData?.best_result}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors">
            <div className="color-dot purple-dark"></div>
            <div className="color-dot purple"></div>
            <div className="color-dot purple-light"></div>
            <div className="color-dot gold"></div>
            <div className="color-dot gold-light"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadLakersInfoDesk;
