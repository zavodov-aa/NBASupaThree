import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./wizardsInfoDesk.css";

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

const InfoHeadWizardsInfoDesk = () => {
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
          .eq("team_name", "Wizards")
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
      .channel("hand-wizards-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Wizards",
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
    return <div className="loading-text">Loading Wizards Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="wizards-containers">
      <div className="header-content-wizards">
        <h1 className="header-title-wizards">INFO DESK</h1>
      </div>

      <div className="table-containersss-wizards desk-card-wrapper-wizards">
        <div className="wizards-desk-card">
          <div className="desk-accent-top-wizards"></div>

          <div className="desk-sections-horizontal-wizards">
            {/* Financial Overview Section */}
            <div className="desk-section-wizards">
              <div className="desk-header-wizards">
                <div className="desk-title-icon-wizards"></div>
                <h3 className="desk-title-wizards">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-wizards">
                <div className="desk-items-vertical-wizards">
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">SALARY CAP</span>
                    <span className="desk-value-wizards">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">CAP HIT</span>
                    <span className="desk-value-wizards">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-wizards highlight-positive-wizards">
                    <span className="desk-label-wizards">CAP SPACE</span>
                    <span className="desk-value-wizards">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">CASH MONEY</span>
                    <span className="desk-value-wizards">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">STANDINGS</span>
                    <span className="desk-value-wizards">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-wizards highlight-negative-wizards">
                    <span className="desk-label-wizards">PENALTIES</span>
                    <span className="desk-value-wizards">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-wizards">
              <div className="desk-header-wizards">
                <div className="desk-title-icon-wizards"></div>
                <h3 className="desk-title-wizards">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-wizards">
                <div className="desk-items-vertical-wizards">
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">ACTIVE ROSTER</span>
                    <span className="desk-value-wizards">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">DEAD CAP</span>
                    <span className="desk-value-wizards">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">G LEAGUE</span>
                    <span className="desk-value-wizards">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">EXTRA POS</span>
                    <span className="desk-value-wizards">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-wizards highlight-playoffs-wizards">
                    <span className="desk-label-wizards">
                      LAST SEASON RESULT
                    </span>
                    <span className="desk-value-wizards">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-wizards">
              <div className="desk-header-wizards">
                <div className="desk-title-icon-wizards"></div>
                <h3 className="desk-title-wizards">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-wizards">
                <div className="desk-items-vertical-wizards">
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">IN TEAM SINCE</span>
                    <span className="desk-value-wizards">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-wizards highlight-championship-wizards">
                    <span className="desk-label-wizards">CHAMPIONSHIPS</span>
                    <span className="desk-value-wizards">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">REGULAR BEST</span>
                    <span className="desk-value-wizards">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">DIVISION WINNER</span>
                    <span className="desk-value-wizards">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-wizards">
                    <span className="desk-label-wizards">PLAYOFFS</span>
                    <span className="desk-value-wizards">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-wizards highlight-championship-wizards">
                    <span className="desk-label-wizards">BEST RESULT</span>
                    <span className="desk-value-wizards">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-wizards">
            <div className="color-dot-wizards navy-wizards"></div>
            <div className="color-dot-wizards blue-wizards"></div>
            <div className="color-dot-wizards red-wizards"></div>
            <div className="color-dot-wizards silver-wizards"></div>
            <div className="color-dot-wizards white-wizards"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadWizardsInfoDesk;
