import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./jazzInfoDesk.css"; // Изменили имя файла CSS

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

const InfoHeadJazzInfoDesk = () => {
  // Изменили название компонента
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
          .eq("team_name", "Jazz") // Изменили на Jazz
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
      .channel("hand-jazz-changes") // Изменили на jazz
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Jazz", // Изменили на Jazz
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
    return <div className="loading-text">Loading Jazz Info Desk...</div>; // Изменили текст
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="jazz-containers">
      <div className="header-content-jazz">
        <h1 className="header-title-jazz">INFO DESK</h1>
      </div>

      <div className="table-containersss-jazz desk-card-wrapper-jazz">
        <div className="jazz-desk-card">
          <div className="desk-accent-top-jazz"></div>

          <div className="desk-sections-horizontal-jazz">
            {/* Financial Overview Section */}
            <div className="desk-section-jazz">
              <div className="desk-header-jazz">
                <div className="desk-title-icon-jazz"></div>
                <h3 className="desk-title-jazz">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-jazz">
                <div className="desk-items-vertical-jazz">
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">SALARY CAP</span>
                    <span className="desk-value-jazz">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">CAP HIT</span>
                    <span className="desk-value-jazz">{teamData?.cap_hit}</span>
                  </div>
                  <div className="desk-item-jazz highlight-positive-jazz">
                    <span className="desk-label-jazz">CAP SPACE</span>
                    <span className="desk-value-jazz">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">CASH MONEY</span>
                    <span className="desk-value-jazz">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">STANDINGS</span>
                    <span className="desk-value-jazz">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-jazz highlight-negative-jazz">
                    <span className="desk-label-jazz">PENALTIES</span>
                    <span className="desk-value-jazz">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-jazz">
              <div className="desk-header-jazz">
                <div className="desk-title-icon-jazz"></div>
                <h3 className="desk-title-jazz">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-jazz">
                <div className="desk-items-vertical-jazz">
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">ACTIVE ROSTER</span>
                    <span className="desk-value-jazz">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">DEAD CAP</span>
                    <span className="desk-value-jazz">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">G LEAGUE</span>
                    <span className="desk-value-jazz">{teamData?.g_leage}</span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">EXTRA POS</span>
                    <span className="desk-value-jazz">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-jazz highlight-playoffs-jazz">
                    <span className="desk-label-jazz">LAST SEASON RESULT</span>
                    <span className="desk-value-jazz">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-jazz">
              <div className="desk-header-jazz">
                <div className="desk-title-icon-jazz"></div>
                <h3 className="desk-title-jazz">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-jazz">
                <div className="desk-items-vertical-jazz">
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">IN TEAM SINCE</span>
                    <span className="desk-value-jazz">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-jazz highlight-championship-jazz">
                    <span className="desk-label-jazz">CHAMPIONSHIPS</span>
                    <span className="desk-value-jazz">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">REGULAR BEST</span>
                    <span className="desk-value-jazz">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">DIVISION WINNER</span>
                    <span className="desk-value-jazz">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-jazz">
                    <span className="desk-label-jazz">PLAYOFFS</span>
                    <span className="desk-value-jazz">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-jazz highlight-championship-jazz">
                    <span className="desk-label-jazz">BEST RESULT</span>
                    <span className="desk-value-jazz">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-jazz">
            <div className="color-dot-jazz navy-blue-jazz"></div>
            <div className="color-dot-jazz yellow-jazz"></div>
            <div className="color-dot-jazz light-gray-jazz"></div>
            <div className="color-dot-jazz dark-navy-jazz"></div>
            <div className="color-dot-jazz gold-yellow-jazz"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadJazzInfoDesk; // Изменили экспорт
