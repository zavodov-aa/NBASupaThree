export type Channel = {
  id: string;
  type: "general" | "announcement" | "direct" | string;
  name: string | null;
  team_ids: string[] | null;
  created_at: string;
};

export type Message = {
  id: string;
  channel_id: string;
  user_id: number;
  team: string;
  text: string | null;
  created_at: string;
  forwarded_from_message_id?: string | null;
  forwarded_from_channel_id?: string | null;
  forwarded_author_team?: string | null;
  forwarded_text?: string | null;
  edited_at?: string | null;
  deleted_at?: string | null;
};
