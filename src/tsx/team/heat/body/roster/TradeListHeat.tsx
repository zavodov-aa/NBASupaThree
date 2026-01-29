import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListHeat.css";

// Типы для данных
interface TradeItem {
  id: number;
  give: string;
  want: string;
}

// Настройка Supabase клиента
const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const TradeListHeat = () => {
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTrade, setNewTrade] = useState<Omit<TradeItem, "id">>({
    give: "",
    want: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("TradeList_Heat")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      setTrades(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!newTrade.give.trim() || !newTrade.want.trim()) {
      alert("Пожалуйста, заполните обе колонки");
      return;
    }

    const { error } = await supabase.from("TradeList_Heat").insert([newTrade]);

    if (!error) {
      setNewTrade({ give: "", want: "" });
      setIsAdding(false);
      fetchTrades();
    } else {
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleUpdate = async (id: number) => {
    const trade = trades.find((item) => item.id === id);
    if (!trade) return;

    if (!trade.give.trim() || !trade.want.trim()) {
      alert("Пожалуйста, заполните обе колонки");
      return;
    }

    const { error } = await supabase
      .from("TradeList_Heat")
      .update({ give: trade.give, want: trade.want })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchTrades();
    } else {
      console.error("Ошибка при обновлении:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      return;
    }

    const { error } = await supabase
      .from("TradeList_Heat")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchTrades();
    } else {
      console.error("Ошибка при удалении:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    fetchTrades();
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewTrade({ give: "", want: "" });
  };

  if (loading) {
    return <div className="trade-loading-text">Loading Trade List...</div>;
  }

  return (
    <div className="trade-list-container-heat">
      <div className="trade-header-content-heat">
        <h1 className="trade-header-title-heat">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-heat">
        <div className="trade-table-wrapper-heat">
          <table className="trade-list-table-heat">
            <thead>
              <tr className="trade-table-header-heat">
                <th className="trade-table-th-heat">НА ОБМЕН</th>
                <th className="trade-table-th-heat">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-heat">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-heat">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-heat ${
                    index % 2 === 0
                      ? "trade-row-even-heat"
                      : "trade-row-odd-heat"
                  }`}
                >
                  <td className="trade-table-td-heat">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-heat"
                        value={trade.give}
                        onChange={(e) =>
                          setTrades(
                            trades.map((t) =>
                              t.id === trade.id
                                ? { ...t, give: e.target.value }
                                : t
                            )
                          )
                        }
                      />
                    ) : (
                      <span className="trade-item-text-heat">{trade.give}</span>
                    )}
                  </td>
                  <td className="trade-table-td-heat">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-heat"
                        value={trade.want}
                        onChange={(e) =>
                          setTrades(
                            trades.map((t) =>
                              t.id === trade.id
                                ? { ...t, want: e.target.value }
                                : t
                            )
                          )
                        }
                      />
                    ) : (
                      <span className="trade-item-text-heat">{trade.want}</span>
                    )}
                  </td>
                  <td className="trade-table-td-heat trade-actions-td-heat">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-heat">
                        <button
                          className="trade-list-btn-heat trade-list-btn-save-heat"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-heat trade-list-btn-cancel-heat"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-heat">
                        <button
                          className="trade-list-btn-heat trade-list-btn-edit-heat"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-heat trade-list-btn-delete-heat"
                          onClick={() => handleDelete(trade.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {isAdding && (
                <tr className="trade-table-row-heat trade-row-adding-heat">
                  <td className="trade-table-td-heat">
                    <input
                      className="trade-list-input-heat"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-heat">
                    <input
                      className="trade-list-input-heat"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-heat trade-actions-td-heat">
                    <div className="trade-list-actions-heat">
                      <button
                        className="trade-list-btn-heat trade-list-btn-save-heat"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-heat trade-list-btn-cancel-heat"
                        onClick={cancelAdd}
                      >
                        Отмена
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdding && (
        <div className="trade-add-button-container-heat">
          <button
            className="trade-list-btn-heat trade-list-btn-add-heat"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListHeat;
