import { useState, useEffect, useCallback } from "react";
import { Player } from "../types/Player";
import { supabase } from "../../../../../Supabase";

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("Players")
        .select("*")
        .order("id");

      if (error) {
        console.error("Error fetching players:", error);
        return;
      }

      setPlayers(data || []);
    };

    fetchPlayers();
  }, []);

  const addPlayer = useCallback(async (newPlayer: Omit<Player, "id">) => {
    const { data, error } = await supabase
      .from("Players")
      .insert([newPlayer])
      .select();

    if (error) {
      console.error("Error adding player:", error);
      throw error;
    }

    if (data?.[0]) {
      setPlayers((prev) => [...prev, data[0]]);
      return data[0];
    }
  }, []);

  const updatePlayer = useCallback(
    async (id: number, updates: Partial<Player>) => {
      const { error } = await supabase
        .from("Players")
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error("Error updating player:", error);
        throw error;
      }

      setPlayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      );
    },
    [],
  );

  return { players, setPlayers, addPlayer, updatePlayer };
};
