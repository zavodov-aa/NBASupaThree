import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./pelicansInfoDesk.css";

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

const InfoHeadPelicansInfoDesk = () => {
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
          .eq("team_name", "Pelicans")
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
      .channel("hand-pelicans-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pelicans",
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
    return <div className="loading-text">Loading Pelicans Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="pelicans-containers">
      <div className="header-content-pelicans">
        <h1 className="header-title-pelicans">INFO DESK</h1>
      </div>

      <div className="table-containersss-pelicans desk-card-wrapper-pelicans">
        <div className="pelicans-desk-card">
          <div className="desk-accent-top-pelicans"></div>

          <div className="desk-sections-horizontal-pelicans">
            {/* Financial Overview Section */}
            <div className="desk-section-pelicans">
              <div className="desk-header-pelicans">
                <div className="desk-title-icon-pelicans"></div>
                <h3 className="desk-title-pelicans">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-pelicans">
                <div className="desk-items-vertical-pelicans">
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">SALARY CAP</span>
                    <span className="desk-value-pelicans">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">CAP HIT</span>
                    <span className="desk-value-pelicans">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-pelicans highlight-positive-pelicans">
                    <span className="desk-label-pelicans">CAP SPACE</span>
                    <span className="desk-value-pelicans">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">CASH MONEY</span>
                    <span className="desk-value-pelicans">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">STANDINGS</span>
                    <span className="desk-value-pelicans">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-pelicans highlight-negative-pelicans">
                    <span className="desk-label-pelicans">PENALTIES</span>
                    <span className="desk-value-pelicans">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-pelicans">
              <div className="desk-header-pelicans">
                <div className="desk-title-icon-pelicans"></div>
                <h3 className="desk-title-pelicans">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-pelicans">
                <div className="desk-items-vertical-pelicans">
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">ACTIVE ROSTER</span>
                    <span className="desk-value-pelicans">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">DEAD CAP</span>
                    <span className="desk-value-pelicans">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">G LEAGUE</span>
                    <span className="desk-value-pelicans">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">EXTRA POS</span>
                    <span className="desk-value-pelicans">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-pelicans highlight-playoffs-pelicans">
                    <span className="desk-label-pelicans">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-pelicans">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-pelicans">
              <div className="desk-header-pelicans">
                <div className="desk-title-icon-pelicans"></div>
                <h3 className="desk-title-pelicans">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-pelicans">
                <div className="desk-items-vertical-pelicans">
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">IN TEAM SINCE</span>
                    <span className="desk-value-pelicans">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-pelicans highlight-championship-pelicans">
                    <span className="desk-label-pelicans">CHAMPIONSHIPS</span>
                    <span className="desk-value-pelicans">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">REGULAR BEST</span>
                    <span className="desk-value-pelicans">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">DIVISION WINNER</span>
                    <span className="desk-value-pelicans">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-pelicans">
                    <span className="desk-label-pelicans">PLAYOFFS</span>
                    <span className="desk-value-pelicans">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-pelicans highlight-championship-pelicans">
                    <span className="desk-label-pelicans">BEST RESULT</span>
                    <span className="desk-value-pelicans">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-pelicans">
            <div className="color-dot-pelicans navy-blue-pelicans"></div>
            <div className="color-dot-pelicans red-pelicans"></div>
            <div className="color-dot-pelicans gold-pelicans"></div>
            <div className="color-dot-pelicans purple-pelicans"></div>
            <div className="color-dot-pelicans green-pelicans"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPelicansInfoDesk;
