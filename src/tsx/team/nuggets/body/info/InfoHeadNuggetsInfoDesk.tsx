import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./nuggetsInfoDesk.css";

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
          .eq("team_name", "Nuggets")
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
      .channel("hand-nuggets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Nuggets",
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
    return <div className="loading-text">Loading Nuggets Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="nuggets-containers">
      <div className="header-content-nuggets">
        <h1 className="header-title-nuggets">INFO DESK</h1>
      </div>

      <div className="table-containersss-nuggets desk-card-wrapper-nuggets">
        <div className="nuggets-desk-card">
          <div className="desk-accent-top-nuggets"></div>

          <div className="desk-sections-horizontal-nuggets">
            {/* Financial Overview Section */}
            <div className="desk-section-nuggets">
              <div className="desk-header-nuggets">
                <div className="desk-title-icon-nuggets"></div>
                <h3 className="desk-title-nuggets">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-nuggets">
                <div className="desk-items-vertical-nuggets">
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">SALARY CAP</span>
                    <span className="desk-value-nuggets">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">CAP HIT</span>
                    <span className="desk-value-nuggets">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-nuggets highlight-positive-nuggets">
                    <span className="desk-label-nuggets">CAP SPACE</span>
                    <span className="desk-value-nuggets">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">CASH MONEY</span>
                    <span className="desk-value-nuggets">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">STANDINGS</span>
                    <span className="desk-value-nuggets">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-nuggets highlight-negative-nuggets">
                    <span className="desk-label-nuggets">PENALTIES</span>
                    <span className="desk-value-nuggets">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-nuggets">
              <div className="desk-header-nuggets">
                <div className="desk-title-icon-nuggets"></div>
                <h3 className="desk-title-nuggets">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-nuggets">
                <div className="desk-items-vertical-nuggets">
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">ACTIVE ROSTER</span>
                    <span className="desk-value-nuggets">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">DEAD CAP</span>
                    <span className="desk-value-nuggets">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">G LEAGUE</span>
                    <span className="desk-value-nuggets">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">EXTRA POS</span>
                    <span className="desk-value-nuggets">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-nuggets highlight-playoffs-nuggets">
                    <span className="desk-label-nuggets">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-nuggets">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-nuggets">
              <div className="desk-header-nuggets">
                <div className="desk-title-icon-nuggets"></div>
                <h3 className="desk-title-nuggets">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-nuggets">
                <div className="desk-items-vertical-nuggets">
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">IN TEAM SINCE</span>
                    <span className="desk-value-nuggets">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-nuggets highlight-championship-nuggets">
                    <span className="desk-label-nuggets">CHAMPIONSHIPS</span>
                    <span className="desk-value-nuggets">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">REGULAR BEST</span>
                    <span className="desk-value-nuggets">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">DIVISION WINNER</span>
                    <span className="desk-value-nuggets">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-nuggets">
                    <span className="desk-label-nuggets">PLAYOFFS</span>
                    <span className="desk-value-nuggets">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-nuggets highlight-championship-nuggets">
                    <span className="desk-label-nuggets">BEST RESULT</span>
                    <span className="desk-value-nuggets">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-nuggets">
            <div className="color-dot-nuggets blue-dark-nuggets"></div>
            <div className="color-dot-nuggets blue-nuggets"></div>
            <div className="color-dot-nuggets blue-light-nuggets"></div>
            <div className="color-dot-nuggets gold-nuggets"></div>
            <div className="color-dot-nuggets gold-light-nuggets"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksInfoDesk;
