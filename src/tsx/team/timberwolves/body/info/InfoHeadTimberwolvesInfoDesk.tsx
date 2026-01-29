import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./timberwolvesInfoDesk.css";

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

const InfoHeadTimberwolvesInfoDesk = () => {
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
          .eq("team_name", "Timberwolves")
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
      .channel("hand-timberwolves-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Timberwolves",
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
    return (
      <div className="loading-text">Loading Timberwolves Info Desk...</div>
    );
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="timberwolves-containers">
      <div className="header-content-timberwolves">
        <h1 className="header-title-timberwolves">INFO DESK</h1>
      </div>

      <div className="table-containersss-timberwolves desk-card-wrapper-timberwolves">
        <div className="timberwolves-desk-card">
          <div className="desk-accent-top-timberwolves"></div>

          <div className="desk-sections-horizontal-timberwolves">
            {/* Financial Overview Section */}
            <div className="desk-section-timberwolves">
              <div className="desk-header-timberwolves">
                <div className="desk-title-icon-timberwolves"></div>
                <h3 className="desk-title-timberwolves">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-timberwolves">
                <div className="desk-items-vertical-timberwolves">
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">SALARY CAP</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">CAP HIT</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves highlight-positive-timberwolves">
                    <span className="desk-label-timberwolves">CAP SPACE</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">CASH MONEY</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">STANDINGS</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves highlight-negative-timberwolves">
                    <span className="desk-label-timberwolves">PENALTIES</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-timberwolves">
              <div className="desk-header-timberwolves">
                <div className="desk-title-icon-timberwolves"></div>
                <h3 className="desk-title-timberwolves">
                  ROSTER & PERFORMANCE
                </h3>
              </div>
              <div className="desk-content-timberwolves">
                <div className="desk-items-vertical-timberwolves">
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">
                      ACTIVE ROSTER
                    </span>
                    <span className="desk-value-timberwolves">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">DEAD CAP</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">G LEAGUE</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">EXTRA POS</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves highlight-playoffs-timberwolves">
                    <span className="desk-label-timberwolves">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-timberwolves">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-timberwolves">
              <div className="desk-header-timberwolves">
                <div className="desk-title-icon-timberwolves"></div>
                <h3 className="desk-title-timberwolves">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-timberwolves">
                <div className="desk-items-vertical-timberwolves">
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">
                      IN TEAM SINCE
                    </span>
                    <span className="desk-value-timberwolves">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves highlight-championship-timberwolves">
                    <span className="desk-label-timberwolves">
                      CHAMPIONSHIPS
                    </span>
                    <span className="desk-value-timberwolves">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">
                      REGULAR BEST
                    </span>
                    <span className="desk-value-timberwolves">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">
                      DIVISION WINNER
                    </span>
                    <span className="desk-value-timberwolves">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves">
                    <span className="desk-label-timberwolves">PLAYOFFS</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-timberwolves highlight-championship-timberwolves">
                    <span className="desk-label-timberwolves">BEST RESULT</span>
                    <span className="desk-value-timberwolves">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-timberwolves">
            <div className="color-dot-timberwolves blue-dark-timberwolves"></div>
            <div className="color-dot-timberwolves blue-timberwolves"></div>
            <div className="color-dot-timberwolves green-timberwolves"></div>
            <div className="color-dot-timberwolves silver-timberwolves"></div>
            <div className="color-dot-timberwolves black-timberwolves"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadTimberwolvesInfoDesk;
