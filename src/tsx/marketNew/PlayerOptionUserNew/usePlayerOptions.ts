import { useEffect, useState } from "react";
import { supabase } from "../../../Supabase";

/**
 * Короткое имя из Pass_team → полное из Players.
 * Порядок — по алфавиту полного названия.
 */
export const TEAM_MAP: Record<string, string> = {
  // Восточная конференция — Атлантический дивизион
  Celtics: "Boston Celtics",
  Nets: "Brooklyn Nets",
  Knicks: "New York Knicks",
  "76ers": "Philadelphia 76ers",
  Raptors: "Toronto Raptors",

  // Восточная конференция — Центральный дивизион
  Bulls: "Chicago Bulls",
  Cavaliers: "Cleveland Cavaliers",
  Pistons: "Detroit Pistons",
  Pacers: "Indiana Pacers",
  Bucks: "Milwaukee Bucks",

  // Восточная конференция — Юго-Восточный дивизион
  Hawks: "Atlanta Hawks",
  Hornets: "Charlotte Hornets",
  Heat: "Miami Heat",
  Magic: "Orlando Magic",
  Wizards: "Washington Wizards",

  // Западная конференция — Северо-Западный дивизион
  Nuggets: "Denver Nuggets",
  Timberwolves: "Minnesota Timberwolves",
  Thunder: "Oklahoma City Thunder",
  Blazers: "Portland Trail Blazers",
  Jazz: "Utah Jazz",

  // Западная конференция — Тихоокеанский дивизион
  Warriors: "Golden State Warriors",
  Clippers: "LA Clippers",
  Lakers: "Los Angeles Lakers",
  Suns: "Phoenix Suns",
  Kings: "Sacramento Kings",

  // Западная конференция — Юго-Западный дивизион
  Mavericks: "Dallas Mavericks",
  Rockets: "Houston Rockets",
  Grizzlies: "Memphis Grizzlies",
  Pelicans: "New Orleans Pelicans",
  Spurs: "San Antonio Spurs",
};

export type PlayerOption = {
  id: number;
  active_roster: string;
  position: string | null;
  age: string | null;
  team: string | null;
  opt: string | null;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  status: string | null;
};

/**
 * «Чистая» числовая сумма: только цифры и пробелы.
 * Допускаем: "35000000", "35 000 000".
 * Отбрасываем: пусто, "UFA", "RFA", "PO-", "INJURY",
 *              "PO-5 151 951 951", "UFA-548 951" и т.п.
 */
function isCleanNumber(value: string | null | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/[A-Za-zА-Яа-я]/.test(trimmed)) return false;
  const digitsOnly = trimmed.replace(/\s+/g, "");
  return /^\d+$/.test(digitsOnly);
}

/** "35 000 000" → 35000000; если не число — null */
export function toNumber(value: string | null | undefined): number | null {
  if (!isCleanNumber(value)) return null;
  const digitsOnly = value!.trim().replace(/\s+/g, "");
  return Number(digitsOnly);
}

export function usePlayerOptions(team: string | null | undefined) {
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!team) {
      setPlayers([]);
      return;
    }

    const fullTeam = TEAM_MAP[team];
    if (!fullTeam) {
      setError(`Неизвестная команда: ${team}. Добавь её в TEAM_MAP.`);
      setPlayers([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Players")
        .select(
          "id, active_roster, position, age, team, opt, year_one, year_two, year_three, year_four, year_five, status",
        )
        .eq("team", fullTeam)
        .eq("opt", "PO");

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setPlayers([]);
        setLoading(false);
        return;
      }

      // year_one — число, year_two — НЕ число (пусто / UFA / RFA / PO / INJURY и т.п.)
      const filtered = (data as PlayerOption[]).filter(
        (p) => isCleanNumber(p.year_one) && !isCleanNumber(p.year_two),
      );

      setPlayers(filtered);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [team]);

  return { players, loading, error };
}
