// hooks/useTeamColor.ts
import { useMemo } from "react";

// Цвета всех 30 команд НБА (основной цвет бренда)
const teamColors: Record<string, string> = {
  // Восточная конференция
  "Atlanta Hawks": "#C8102E", // красный
  "Boston Celtics": "#007A33", // зелёный
  "Brooklyn Nets": "#000000", // чёрный
  "Charlotte Hornets": "#1D1160", // тёмно-синий
  "Chicago Bulls": "#CE1141", // красный
  "Cleveland Cavaliers": "#860038", // винный
  "Detroit Pistons": "#C8102E", // красный
  "Indiana Pacers": "#002D62", // тёмно-синий
  "Miami Heat": "#98002E", // красный
  "Milwaukee Bucks": "#00471B", // тёмно-зелёный
  "New York Knicks": "#006BB6", // синий
  "Orlando Magic": "#0077C0", // синий
  "Philadelphia 76ers": "#006BB6", // синий
  "Toronto Raptors": "#CE1141", // красный
  "Washington Wizards": "#002B5C", // тёмно-синий

  // Западная конференция
  "Dallas Mavericks": "#00538C", // синий
  "Denver Nuggets": "#0E2240", // тёмно-синий
  "Golden State Warriors": "#FFC72C", // жёлтый
  "Houston Rockets": "#CE1141", // красный
  "LA Clippers": "#C8102E", // красный
  "Los Angeles Lakers": "#552583", // фиолетовый
  "Memphis Grizzlies": "#5D76A9", // синий
  "Minnesota Timberwolves": "#0C2340", // тёмно-синий
  "New Orleans Pelicans": "#0C2340", // тёмно-синий
  "Oklahoma City Thunder": "#007AC1", // синий
  "Phoenix Suns": "#1D1160", // тёмно-синий
  "Portland Trail Blazers": "#E03A3E", // красный
  "Sacramento Kings": "#5A2D81", // фиолетовый
  "San Antonio Spurs": "#000000", // чёрный (основной серебристый заменён для контраста)
  "Utah Jazz": "#002B5C", // тёмно-синий
};

const defaultColor = "#3b82f6"; // цвет по умолчанию (синий)

export const useTeamColor = (teamName: string): string => {
  return useMemo(() => {
    return teamColors[teamName] || defaultColor;
  }, [teamName]);
};
