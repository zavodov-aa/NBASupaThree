import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./teamBodyGeneralTradeList.css";

export type NBATeamName =
  | "Atlanta Hawks"
  | "Boston Celtics"
  | "Brooklyn Nets"
  | "Charlotte Hornets"
  | "Chicago Bulls"
  | "Cleveland Cavaliers"
  | "Dallas Mavericks"
  | "Denver Nuggets"
  | "Detroit Pistons"
  | "Golden State Warriors"
  | "Houston Rockets"
  | "Indiana Pacers"
  | "LA Clippers"
  | "Los Angeles Lakers"
  | "Memphis Grizzlies"
  | "Miami Heat"
  | "Milwaukee Bucks"
  | "Minnesota Timberwolves"
  | "New Orleans Pelicans"
  | "New York Knicks"
  | "Oklahoma City Thunder"
  | "Orlando Magic"
  | "Philadelphia 76ers"
  | "Phoenix Suns"
  | "Portland Trail Blazers"
  | "Sacramento Kings"
  | "San Antonio Spurs"
  | "Toronto Raptors"
  | "Utah Jazz"
  | "Washington Wizards";

interface TradeRecord {
  id: string;
  team: NBATeamName;
  give: string;
  want: string;
}

interface TeamBodyGeneralTradeListProps {
  teamId: NBATeamName;
}

const TeamBodyGeneralTradeList: React.FC<TeamBodyGeneralTradeListProps> = ({
  teamId,
}) => {
  const [records, setRecords] = useState<TradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editGive, setEditGive] = useState("");
  const [editWant, setEditWant] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newGive, setNewGive] = useState("");
  const [newWant, setNewWant] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("TradeList_Main")
        .select("*")
        .eq("team", teamId)
        .order("created_at", { ascending: true });

      if (supabaseError) throw supabaseError;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const handleAdd = async () => {
    try {
      const { error: supabaseError } = await supabase
        .from("TradeList_Main")
        .insert([{ team: teamId, give: newGive, want: newWant }]);

      if (supabaseError) throw supabaseError;

      setNewGive("");
      setNewWant("");
      setIsAdding(false);
      fetchData();
    } catch (err) {
      alert(
        "Ошибка при добавлении: " + (err instanceof Error ? err.message : ""),
      );
    }
  };

  const startEdit = (record: TradeRecord) => {
    setEditingId(record.id);
    setEditGive(record.give);
    setEditWant(record.want);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditGive("");
    setEditWant("");
  };

  const saveEdit = async () => {
    try {
      const { error: supabaseError } = await supabase
        .from("TradeList_Main")
        .update({ give: editGive, want: editWant })
        .eq("id", editingId);

      if (supabaseError) throw supabaseError;

      cancelEdit();
      fetchData();
    } catch (err) {
      alert(
        "Ошибка при сохранении: " + (err instanceof Error ? err.message : ""),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить запись?")) return;
    try {
      const { error: supabaseError } = await supabase
        .from("TradeList_Main")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      fetchData();
    } catch (err) {
      alert(
        "Ошибка при удалении: " + (err instanceof Error ? err.message : ""),
      );
    }
  };

  if (loading) return <div className="tradeListMain-loading">Загрузка...</div>;
  if (error) return <div className="tradeListMain-error">Ошибка: {error}</div>;

  return (
    <div className="tradeListMain-container">
      <div className="tradeListMain-header">
        <h2 className="tradeListMain-title">Trade List — {teamId}</h2>
        <button
          className="tradeListMain-addButton"
          onClick={() => setIsAdding(true)}
        >
          + Добавить
        </button>
      </div>

      <table className="tradeListMain-table">
        <thead>
          <tr>
            <th className="tradeListMain-th">На обмене</th>
            <th className="tradeListMain-th">Список желаемого</th>
            <th className="tradeListMain-th">Действия</th>
          </tr>
        </thead>
        <tbody>
          {/* Режим добавления новой строки */}
          {isAdding && (
            <tr className="tradeListMain-row">
              <td className="tradeListMain-td">
                <input
                  type="text"
                  value={newGive}
                  onChange={(e) => setNewGive(e.target.value)}
                  placeholder="Игрок на обмен"
                  className="tradeListMain-input"
                />
              </td>
              <td className="tradeListMain-td">
                <input
                  type="text"
                  value={newWant}
                  onChange={(e) => setNewWant(e.target.value)}
                  placeholder="Желаемый игрок"
                  className="tradeListMain-input"
                />
              </td>
              <td className="tradeListMain-td">
                <button
                  className="tradeListMain-saveButton"
                  onClick={handleAdd}
                >
                  ✓ Сохранить
                </button>
                <button
                  className="tradeListMain-cancelButton"
                  onClick={() => setIsAdding(false)}
                >
                  ✗ Отмена
                </button>
              </td>
            </tr>
          )}

          {/* Список существующих записей */}
          {records.map((record) => (
            <tr key={record.id} className="tradeListMain-row">
              {editingId === record.id ? (
                // Режим редактирования
                <>
                  <td className="tradeListMain-td">
                    <input
                      type="text"
                      value={editGive}
                      onChange={(e) => setEditGive(e.target.value)}
                      className="tradeListMain-input"
                    />
                  </td>
                  <td className="tradeListMain-td">
                    <input
                      type="text"
                      value={editWant}
                      onChange={(e) => setEditWant(e.target.value)}
                      className="tradeListMain-input"
                    />
                  </td>
                  <td className="tradeListMain-td">
                    <button
                      className="tradeListMain-saveButton"
                      onClick={saveEdit}
                    >
                      💾 Сохранить
                    </button>
                    <button
                      className="tradeListMain-cancelButton"
                      onClick={cancelEdit}
                    >
                      ✗ Отмена
                    </button>
                  </td>
                </>
              ) : (
                // Обычный просмотр
                <>
                  <td className="tradeListMain-td">{record.give}</td>
                  <td className="tradeListMain-td">{record.want}</td>
                  <td className="tradeListMain-td">
                    <button
                      className="tradeListMain-editButton"
                      onClick={() => startEdit(record)}
                    >
                      ✏️
                    </button>
                    <button
                      className="tradeListMain-deleteButton"
                      onClick={() => handleDelete(record.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

          {records.length === 0 && !isAdding && (
            <tr>
              <td colSpan={3} className="tradeListMain-empty">
                Нет данных. Нажмите «Добавить», чтобы создать первую запись.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamBodyGeneralTradeList;
