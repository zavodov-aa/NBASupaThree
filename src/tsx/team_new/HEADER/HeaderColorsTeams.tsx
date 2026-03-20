// // teamColors.ts
// export const teamColors: Record<string, { bg: string; text: string }> = {
//   // Атланта Хокс
//   hawks: { bg: "#E13A3E", text: "#C4CED4" },
//   // Бостон Селтикс
//   celtics: { bg: "#007A33", text: "#BA9653" },
//   // Бруклин Нетс
//   nets: { bg: "#000000", text: "#FFFFFF" },
//   // Шарлотт Хорнетс
//   hornets: { bg: "#1D1160", text: "#00788C" },
//   // Чикаго Буллз
//   bulls: { bg: "#CE1141", text: "#000000" },
//   // Кливленд Кавальерс
//   cavaliers: { bg: "#860038", text: "#FDBB30" },
//   // Даллас Маверикс
//   mavericks: { bg: "#00538C", text: "#B8C4CA" },
//   // Денвер Наггетс
//   nuggets: { bg: "#0E2240", text: "#FEC524" },
//   // Детройт Пистонс
//   pistons: { bg: "#C8102E", text: "#1D42BA" },
//   // Голден Стэйт Уорриорз
//   warriors: { bg: "#1D428A", text: "#FFC72C" },
//   // Хьюстон Рокетс
//   rockets: { bg: "#CE1141", text: "#000000" },
//   // Индиана Пэйсерс
//   pacers: { bg: "#002D62", text: "#FDBB30" },
//   // Лос-Анджелес Клипперс
//   clippers: { bg: "#C8102E", text: "#1D42BA" },
//   // Лос-Анджелес Лейкерс
//   lakers: { bg: "#552583", text: "#FDB927" },
//   // Мемфис Гриззлис
//   grizzlies: { bg: "#5D76A9", text: "#12173F" },
//   // Майами Хит
//   heat: { bg: "#98002E", text: "#F9A01B" },
//   // Милуоки Бакс
//   bucks: { bg: "#00471B", text: "#EEE1C6" },
//   // Миннесота Тимбервулвз
//   timberwolves: { bg: "#0C2340", text: "#78BE20" },
//   // Нью-Орлеан Пеликанс
//   pelicans: { bg: "#0C2340", text: "#C8102E" },
//   // Нью-Йорк Никс
//   knicks: { bg: "#006BB6", text: "#F58426" },
//   // Оклахома-Сити Тандер
//   thunder: { bg: "#007AC1", text: "#EF3B24" },
//   // Орландо Мэджик
//   magic: { bg: "#0077C0", text: "#C4CED4" },
//   // Филадельфия Севенти Сиксерс
//   sixers: { bg: "#006BB6", text: "#ED174C" },
//   // Финикс Санз
//   suns: { bg: "#1D1160", text: "#E56020" },
//   // Портленд Трэйл Блэйзерс
//   trailblazers: { bg: "#E03A3E", text: "#000000" },
//   // Сакраменто Кингз
//   kings: { bg: "#5A2D81", text: "#63727A" },
//   // Сан-Антонио Спёрс
//   spurs: { bg: "#C4CED4", text: "#000000" },
//   // Торонто Рэпторс
//   raptors: { bg: "#CE1141", text: "#000000" },
//   // Юта Джаз
//   jazz: { bg: "#002B5C", text: "#F9A01B" },
//   // Вашингтон Уизардс
//   wizards: { bg: "#002B5C", text: "#E31837" },
// };

// teamColors.ts
export const teamColors: Record<
  string,
  { bg: string; text: string; logo: "white" | "black" | "original" }
> = {
  hawks: { bg: "#E13A3E", text: "#C4CED4", logo: "white" },
  celtics: { bg: "#007A33", text: "#BA9653", logo: "white" },
  nets: { bg: "#000000", text: "#FFFFFF", logo: "white" },
  hornets: { bg: "#1D1160", text: "#00788C", logo: "white" },
  bulls: { bg: "#CE1141", text: "#000000", logo: "white" },
  cavaliers: { bg: "#860038", text: "#FDBB30", logo: "white" },
  mavericks: { bg: "#00538C", text: "#B8C4CA", logo: "white" },
  nuggets: { bg: "#0E2240", text: "#FEC524", logo: "white" },
  pistons: { bg: "#C8102E", text: "#1D42BA", logo: "white" },
  warriors: { bg: "#1D428A", text: "#FFC72C", logo: "white" },
  rockets: { bg: "#CE1141", text: "#000000", logo: "white" },
  pacers: { bg: "#002D62", text: "#FDBB30", logo: "white" },
  clippers: { bg: "#C8102E", text: "#1D42BA", logo: "white" },
  lakers: { bg: "#552583", text: "#FDB927", logo: "white" },
  grizzlies: { bg: "#5D76A9", text: "#12173F", logo: "black" }, // фон светловат
  heat: { bg: "#98002E", text: "#F9A01B", logo: "white" },
  bucks: { bg: "#00471B", text: "#EEE1C6", logo: "white" },
  timberwolves: { bg: "#0C2340", text: "#78BE20", logo: "white" },
  pelicans: { bg: "#0C2340", text: "#C8102E", logo: "white" },
  knicks: { bg: "#006BB6", text: "#F58426", logo: "white" },
  thunder: { bg: "#007AC1", text: "#EF3B24", logo: "white" },
  magic: { bg: "#0077C0", text: "#C4CED4", logo: "white" },
  sixers: { bg: "#006BB6", text: "#ED174C", logo: "white" },
  suns: { bg: "#1D1160", text: "#E56020", logo: "white" },
  trailblazers: { bg: "#E03A3E", text: "#000000", logo: "white" },
  kings: { bg: "#5A2D81", text: "#63727A", logo: "white" },
  spurs: { bg: "#C4CED4", text: "#000000", logo: "black" }, // светлый фон
  raptors: { bg: "#CE1141", text: "#000000", logo: "white" },
  jazz: { bg: "#002B5C", text: "#F9A01B", logo: "white" },
  wizards: { bg: "#002B5C", text: "#E31837", logo: "white" },
};
