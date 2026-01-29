import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./bucksInfoDesk.css";

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

const InfoHeadBucksInfoDesk = () => {
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
          .eq("team_name", "Bucks")
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
      .channel("bucks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Bucks",
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
    return <div className="loading-text">Loading Bucks Info Desk...</div>;
  if (error)
    return <div className="loading-text error-text">Error: {error}</div>;

  return (
    <div className="bucks-containers">
      <div className="header-content-bucks">
        <h1 className="header-title-bucks">INFO DESK</h1>
      </div>

      <div className="table-containersss-bucks desk-card-wrapper-bucks">
        <div className="bucks-desk-card">
          <div className="desk-accent-top-bucks"></div>

          <div className="desk-sections-horizontal-bucks">
            {/* Financial Overview Section */}
            <div className="desk-section-bucks">
              <div className="desk-header-bucks">
                <div className="desk-title-icon-bucks"></div>
                <h3 className="desk-title-bucks">FINANCIAL OVERVIEW</h3>
              </div>
              <div className="desk-content-bucks">
                <div className="desk-items-vertical-bucks">
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">SALARY CAP</span>
                    <span className="desk-value-bucks">
                      {teamData?.salary_cap}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">CAP HIT</span>
                    <span className="desk-value-bucks">
                      {teamData?.cap_hit}
                    </span>
                  </div>
                  <div className="desk-item-bucks highlight-positive-bucks">
                    <span className="desk-label-bucks">CAP SPACE</span>
                    <span className="desk-value-bucks">
                      {teamData?.cap_space}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">CASH MONEY</span>
                    <span className="desk-value-bucks">
                      {teamData?.cash_money}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">STANDINGS</span>
                    <span className="desk-value-bucks">
                      {teamData?.standing}
                    </span>
                  </div>
                  <div className="desk-item-bucks highlight-negative-bucks">
                    <span className="desk-label-bucks">PENALTIES</span>
                    <span className="desk-value-bucks">
                      {teamData?.penalties}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roster & Performance Section */}
            <div className="desk-section-bucks">
              <div className="desk-header-bucks">
                <div className="desk-title-icon-bucks"></div>
                <h3 className="desk-title-bucks">ROSTER & PERFORMANCE</h3>
              </div>
              <div className="desk-content-bucks">
                <div className="desk-items-vertical-bucks">
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">ACTIVE ROSTER</span>
                    <span className="desk-value-bucks">
                      {teamData?.active_roster}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">DEAD CAP</span>
                    <span className="desk-value-bucks">
                      {teamData?.dead_cap}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">G LEAGUE</span>
                    <span className="desk-value-bucks">
                      {teamData?.g_leage}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">EXTRA POS</span>
                    <span className="desk-value-bucks">
                      {teamData?.extra_pos}
                    </span>
                  </div>
                  <div className="desk-item-bucks highlight-playoffs-bucks">
                    <span className="desk-label-bucks">LAST SEASON RESULT</span>
                    <span className="desk-value-bucks">
                      {teamData?.last_season_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise History Section */}
            <div className="desk-section-bucks">
              <div className="desk-header-bucks">
                <div className="desk-title-icon-bucks"></div>
                <h3 className="desk-title-bucks">FRANCHISE HISTORY</h3>
              </div>
              <div className="desk-content-bucks">
                <div className="desk-items-vertical-bucks">
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">IN TEAM SINCE</span>
                    <span className="desk-value-bucks">
                      {teamData?.in_team_since}
                    </span>
                  </div>
                  <div className="desk-item-bucks highlight-championship-bucks">
                    <span className="desk-label-bucks">CHAMPIONSHIPS</span>
                    <span className="desk-value-bucks">
                      {teamData?.championships}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">REGULAR BEST</span>
                    <span className="desk-value-bucks">
                      {teamData?.regular_best}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">DIVISION WINNER</span>
                    <span className="desk-value-bucks">
                      {teamData?.division_winner}
                    </span>
                  </div>
                  <div className="desk-item-bucks">
                    <span className="desk-label-bucks">PLAYOFFS</span>
                    <span className="desk-value-bucks">
                      {teamData?.playoffs}
                    </span>
                  </div>
                  <div className="desk-item-bucks highlight-championship-bucks">
                    <span className="desk-label-bucks">BEST RESULT</span>
                    <span className="desk-value-bucks">
                      {teamData?.best_result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="desk-colors-bucks">
            <div className="color-dot-bucks green-dark-bucks"></div>
            <div className="color-dot-bucks green-bucks"></div>
            <div className="color-dot-bucks cream-bucks"></div>
            <div className="color-dot-bucks blue-bucks"></div>
            <div className="color-dot-bucks silver-bucks"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBucksInfoDesk;
