import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterSpursFix.css";

type Player = {
  id: number;
  active_roster: string;
  position: string;
  pos_elig: string;
  age: string | null;
  year_one: string | null;  
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  opt: string;
  exp: string;
  bird: string;
  awards: string;
  team: string;
  g_league: string;
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const RosterSpurs: React.FC = () => {
  const [franchisePlayer, setFranchisePlayer] = useState<Player | null>(null);
  const [mainRoster, setMainRoster] = useState<Player[]>([]);
  const [gLeagueRoster, setGLeagueRoster] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const parseSalary = (salary: string | null): number => {
    if (!salary) return 0;
    return parseFloat(salary.replace(/[$,]/g, "")) || 0;
  };

  // Функция для форматирования чисел с разделителями тысяч (точка)
  const formatNumber = (
    value: string | null,
    isFranchisePlayer: boolean = false
  ): string => {
    // Для франчайзного игрока (id=1) возвращаем значение как есть
    if (isFranchisePlayer && value) {
      return value;
    }

    if (!value || value === "—") return "—";

    // Убираем все нецифровые символы, кроме точки для десятичных
    const cleanValue = value.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleanValue);

    // Если не число, возвращаем исходное значение
    if (isNaN(num)) return value;

    // Форматируем с разделителями тысяч (точка)
    return num.toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const sortBySalary = (players: Player[]): Player[] => {
    return [...players].sort(
      (a, b) => parseSalary(b.year_one) - parseSalary(a.year_one)
    );
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data: franchiseData, error: franchiseError } = await supabase
          .from("Players")
          .select("*")
          .eq("id", 1)
          .single();

        if (franchiseError && franchiseError.code !== "PGRST116") {
          console.error("Error fetching franchise player:", franchiseError);
        }

        if (franchiseData) {
          setFranchisePlayer(franchiseData);
        }

        const { data: mainData, error: mainError } = await supabase
          .from("Players")
          .select("*")
          .eq("team", "San Antonio Spurs");

        if (mainError) {
          console.error("Error fetching main roster:", mainError);
        } else {
          const filteredMain =
            mainData?.filter((player) => player.id !== 1) || [];
          setMainRoster(sortBySalary(filteredMain));
        }

        const { data: gLeagueData, error: gLeagueError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "San Antonio Spurs");

        if (gLeagueError) {
          console.error("Error fetching G-League roster:", gLeagueError);
        } else {
          const filteredGLeague =
            gLeagueData?.filter((player) => player.id !== 1) || [];
          setGLeagueRoster(sortBySalary(filteredGLeague));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const getColumnHeader = (column: string) => {
    if (!isMobile) return column;
    const shortNames: { [key: string]: string } = {
      "ACTIVE ROSTER": "PLAYER",
      "POS ELIG": "ELIG",
      "YEAR ONE": "Y1",
      "YEAR TWO": "Y2",
      "YEAR THREE": "Y3",
      "YEAR FOUR": "Y4",
      "YEAR FIVE": "Y5",
      OPT: "OPT",
      EXP: "EXP",
      BIRD: "BIRD",
      AWARDS: "AWDS",
    };
    return shortNames[column] || column;
  };

  const renderPlayerRow = (player: Player, index: number) => {
    const isFranchisePlayer = player.id === 1;

    return (
      <tr key={player.id} className={isFranchisePlayer ? "franchiseSpurs" : ""}>
        <td>
          <div className="number-cellSpurs">
            {index + 1}
            {isFranchisePlayer && <span className="starSpurs">★</span>}
          </div>
        </td>
        <td>
          <span className="player-tagSpurs">{player.active_roster}</span>
        </td>
        <td>{player.position}</td>
        <td>{player.pos_elig}</td>
        <td>{player.age || "—"}</td>
        <td className="highlightSpurs">
          {formatNumber(player.year_one, isFranchisePlayer)}
        </td>
        <td>{formatNumber(player.year_two, isFranchisePlayer)}</td>
        <td>{formatNumber(player.year_three, isFranchisePlayer)}</td>
        <td>{formatNumber(player.year_four, isFranchisePlayer)}</td>
        <td>{formatNumber(player.year_five, isFranchisePlayer)}</td>
        <td>{player.opt || "—"}</td>
        <td>{player.exp || "—"}</td>
        <td>{player.bird || "—"}</td>
        <td>{player.awards || "—"}</td>
      </tr>
    );
  };

  if (loading) return <div className="loading">Loading Roster...</div>;

  const hasPlayers =
    franchisePlayer || mainRoster.length > 0 || gLeagueRoster.length > 0;

  return (
    <div className="rosterSpurs">
      <div className="roster-headerSpurs">
        <h1>SPURS ROSTER</h1>
        <div className="roster-subtitleSpurs">ACTIVE PLAYERS & CONTRACTS</div>
      </div>

      {hasPlayers ? (
        <div className="table-containerSpurs">
          <table className="roster-tableSpurs">
            <tbody>
              {franchisePlayer && renderPlayerRow(franchisePlayer, 0)}

              {mainRoster.map((player, index) =>
                renderPlayerRow(player, index + (franchisePlayer ? 1 : 0))
              )}

              {gLeagueRoster.length > 0 && (
                <tr className="g-league-dividerSpurs">
                  <td colSpan={14}>
                    <div className="g-league-headerSpurs">G-LEAGUE ROSTER</div>
                  </td>
                </tr>
              )}

              {gLeagueRoster.map((player, index) =>
                renderPlayerRow(
                  player,
                  index + (franchisePlayer ? 1 : 0) + mainRoster.length
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-stateSpurs">
          <div className="empty-iconSpurs">🏀</div>
          <div className="empty-titleSpurs">No Players in Roster</div>
          <div className="empty-subtitleSpurs">
            Currently no players are assigned to the Spurs team
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterSpurs;
