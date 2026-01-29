import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./rocketsInfoDesk.css";

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

const InfoHeadRocketsInfoDesk = () => {
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
          .eq("team_name", "Rockets")
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
      .channel("hand-rockets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Rockets",
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
    return <div className="loading-text">Loading Rockets Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="rockets-containers">
      <div className="header-content-rockets">
        <h1 className="header-title-rockets">INFO DESK</h1>
      </div>

      <div className="table-containersss-rockets desk-card-wrapper-rockets">
        <div className="rockets-desk-card">
          <div className="desk-accent-top-rockets"></div>

          <div className="desk-sections-horizontal-rockets">
            {/* Financial Overview Section */}
            <div className="desk-section-rockets">
              <div className="desk-header-rockets">
                <div className="desk-title-icon-rockets"></div>
                <h3 className="desk-title-rockets">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-rockets">
                <div className="desk-items-vertical-rockets">
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">SALARY CAP</span>
                    <span className="desk-value-rockets">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">CAP HIT</span>
                    <span className="desk-value-rockets">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-rockets highlight-positive-rockets">
                    <span className="desk-label-rockets">CAP SPACE</span>
                    <span className="desk-value-rockets">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">CASH MONEY</span>
                    <span className="desk-value-rockets">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">STANDINGS</span>
                    <span className="desk-value-rockets">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-rockets highlight-negative-rockets">
                    <span className="desk-label-rockets">PENALTIES</span>
                    <span className="desk-value-rockets">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-rockets">
              <div className="desk-header-rockets">
                <div className="desk-title-icon-rockets"></div>
                <h3 className="desk-title-rockets">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-rockets">
                <div className="desk-items-vertical-rockets">
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">ACTIVE ROSTER</span>
                    <span className="desk-value-rockets">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">DEAD CAP</span>
                    <span className="desk-value-rockets">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">G LEAGUE</span>
                    <span className="desk-value-rockets">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">EXTRA POS</span>
                    <span className="desk-value-rockets">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-rockets highlight-playoffs-rockets">
                    <span className="desk-label-rockets">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-rockets">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-rockets">
              <div className="desk-header-rockets">
                <div className="desk-title-icon-rockets"></div>
                <h3 className="desk-title-rockets">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-rockets">
                <div className="desk-items-vertical-rockets">
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">IN TEAM SINCE</span>
                    <span className="desk-value-rockets">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-rockets highlight-championship-rockets">
                    <span className="desk-label-rockets">CHAMPIONSHIPS</span>
                    <span className="desk-value-rockets">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">REGULAR BEST</span>
                    <span className="desk-value-rockets">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">DIVISION WINNER</span>
                    <span className="desk-value-rockets">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-rockets">
                    <span className="desk-label-rockets">PLAYOFFS</span>
                    <span className="desk-value-rockets">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-rockets highlight-championship-rockets">
                    <span className="desk-label-rockets">BEST RESULT</span>
                    <span className="desk-value-rockets">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-rockets">
            <div className="color-dot-rockets red-dark-rockets"></div>
            <div className="color-dot-rockets red-rockets"></div>
            <div className="color-dot-rockets silver-rockets"></div>
            <div className="color-dot-rockets black-rockets"></div>
            <div className="color-dot-rockets white-rockets"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadRocketsInfoDesk;
