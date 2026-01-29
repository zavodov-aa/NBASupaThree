import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./magicInfoDesk.css";

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

const InfoHeadMagicInfoDesk = () => {
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
          .eq("team_name", "Magic")
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
      .channel("hand-magic-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Magic",
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
    return <div className="loading-text">Loading Magic Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="magic-containers">
      <div className="header-content-magic">
        <h1 className="header-title-magic">INFO DESK</h1>
      </div>

      <div className="table-containersss-magic desk-card-wrapper-magic">
        <div className="magic-desk-card">
          <div className="desk-accent-top-magic"></div>

          <div className="desk-sections-horizontal-magic">
            {/* Financial Overview Section */}
            <div className="desk-section-magic">
              <div className="desk-header-magic">
                <div className="desk-title-icon-magic"></div>
                <h3 className="desk-title-magic">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-magic">
                <div className="desk-items-vertical-magic">
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">SALARY CAP</span>
                    <span className="desk-value-magic">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">CAP HIT</span>
                    <span className="desk-value-magic">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-magic highlight-positive-magic">
                    <span className="desk-label-magic">CAP SPACE</span>
                    <span className="desk-value-magic">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">CASH MONEY</span>
                    <span className="desk-value-magic">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">STANDINGS</span>
                    <span className="desk-value-magic">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-magic highlight-negative-magic">
                    <span className="desk-label-magic">PENALTIES</span>
                    <span className="desk-value-magic">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-magic">
              <div className="desk-header-magic">
                <div className="desk-title-icon-magic"></div>
                <h3 className="desk-title-magic">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-magic">
                <div className="desk-items-vertical-magic">
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">ACTIVE ROSTER</span>
                    <span className="desk-value-magic">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">DEAD CAP</span>
                    <span className="desk-value-magic">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">G LEAGUE</span>
                    <span className="desk-value-magic">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">EXTRA POS</span>
                    <span className="desk-value-magic">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-magic highlight-playoffs-magic">
                    <span className="desk-label-magic">LAST SEASON RESULT</span>
                    <span className="desk-value-magic">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-magic">
              <div className="desk-header-magic">
                <div className="desk-title-icon-magic"></div>
                <h3 className="desk-title-magic">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-magic">
                <div className="desk-items-vertical-magic">
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">IN TEAM SINCE</span>
                    <span className="desk-value-magic">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-magic highlight-championship-magic">
                    <span className="desk-label-magic">CHAMPIONSHIPS</span>
                    <span className="desk-value-magic">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">REGULAR BEST</span>
                    <span className="desk-value-magic">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">DIVISION WINNER</span>
                    <span className="desk-value-magic">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-magic">
                    <span className="desk-label-magic">PLAYOFFS</span>
                    <span className="desk-value-magic">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-magic highlight-championship-magic">
                    <span className="desk-label-magic">BEST RESULT</span>
                    <span className="desk-value-magic">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-magic">
            <div className="color-dot-magic blue-dark-magic"></div>
            <div className="color-dot-magic blue-magic"></div>
            <div className="color-dot-magic silver-magic"></div>
            <div className="color-dot-magic black-magic"></div>
            <div className="color-dot-magic white-magic"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadMagicInfoDesk;
