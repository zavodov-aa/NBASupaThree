// Цвета фиксированные — одинаковы на всех устройствах и для всех пользователей.
// Ключ — название команды как в NBA_TEAMS (см. ChatMain).
export const TEAM_COLORS: Record<string, string> = {
  Commissioner: "#6b7280",
  Hawks: "#e03a3e",
  Celtics: "#007a33",
  Nets: "#1d1d1d",
  Hornets: "#1d1160",
  Bulls: "#ce1141",
  Cavaliers: "#860038",
  Mavericks: "#00538c",
  Nuggets: "#0e2240",
  Pistons: "#c8102e",
  Warriors: "#1d428a",
  Rockets: "#ce1141",
  Pacers: "#002d62",
  Clippers: "#c8102e",
  Lakers: "#552583",
  Grizzlies: "#5d76a9",
  Heat: "#98002e",
  Bucks: "#00471b",
  Timberwolves: "#0c2340",
  Pelicans: "#0c2340",
  Knicks: "#006bb6",
  Thunder: "#007ac1",
  Magic: "#0077c0",
  "76ers": "#006bb6",
  Suns: "#1d1160",
  Blazers: "#e03a3e",
  Kings: "#5a2d81",
  Spurs: "#c4ced4",
  Raptors: "#ce1141",
  Jazz: "#002b5c",
  Wizards: "#002b5c",
  test: "#9ca3af",
};

const FALLBACK = "#9ca3af";

// Стабильный хеш на случай, если команда не описана в TEAM_COLORS
const FALLBACKS = [
  "#e03a3e",
  "#007a33",
  "#1d428a",
  "#552583",
  "#ce1141",
  "#006bb6",
  "#0e2240",
  "#5a2d81",
  "#98002e",
  "#00471b",
];

export function getTeamColor(team?: string | null): string {
  if (!team) return FALLBACK;
  if (TEAM_COLORS[team]) return TEAM_COLORS[team];
  let h = 0;
  for (let i = 0; i < team.length; i++) h = (h * 31 + team.charCodeAt(i)) | 0;
  return FALLBACKS[Math.abs(h) % FALLBACKS.length];
}

// Проверка "тёмный ли цвет" — чтобы понять, нужен ли белый текст
export function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // perception luminance
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}
