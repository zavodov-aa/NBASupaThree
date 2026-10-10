// types.ts
export interface Team {
  id: string;
  name: string;
  route?: string;
  conference: "east" | "west";
  color?: string;
  secondaryColor?: string; // Опционально для градиентов
  img_path?: string;
}

export interface ConsoleItem {
  id: string;
  name: string;
  route: string;
}

export interface EventsLeague {
  id: string;
  name: string;
  route?: string;
}

export interface MarketItem {
  id: string;
  name: string;
  route: string;
}

export type TabType = "teams" | "console" | "reserve" | "market";

export interface FeedbackData {
  date: string;
  errors: string;
  offers: string;
}
