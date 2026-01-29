import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListGrizzlies.css";

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

const TradeListGrizzlies = () => {
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
      .from("TradeList_Grizzlies")
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

    const { error } = await supabase
      .from("TradeList_Grizzlies")
      .insert([newTrade]);

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
      .from("TradeList_Grizzlies")
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
      .from("TradeList_Grizzlies")
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
    <div className="trade-list-container-grizzlies">
      <div className="trade-header-content-grizzlies">
        <h1 className="trade-header-title-grizzlies">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-grizzlies">
        <div className="trade-table-wrapper-grizzlies">
          <table className="trade-list-table-grizzlies">
            <thead>
              <tr className="trade-table-header-grizzlies">
                <th className="trade-table-th-grizzlies">НА ОБМЕН</th>
                <th className="trade-table-th-grizzlies">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-grizzlies">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-grizzlies">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-grizzlies ${
                    index % 2 === 0
                      ? "trade-row-even-grizzlies"
                      : "trade-row-odd-grizzlies"
                  }`}
                >
                  <td className="trade-table-td-grizzlies">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-grizzlies"
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
                      <span className="trade-item-text-grizzlies">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-grizzlies">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-grizzlies"
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
                      <span className="trade-item-text-grizzlies">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-grizzlies trade-actions-td-grizzlies">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-grizzlies">
                        <button
                          className="trade-list-btn-grizzlies trade-list-btn-save-grizzlies"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-grizzlies trade-list-btn-cancel-grizzlies"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-grizzlies">
                        <button
                          className="trade-list-btn-grizzlies trade-list-btn-edit-grizzlies"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-grizzlies trade-list-btn-delete-grizzlies"
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
                <tr className="trade-table-row-grizzlies trade-row-adding-grizzlies">
                  <td className="trade-table-td-grizzlies">
                    <input
                      className="trade-list-input-grizzlies"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-grizzlies">
                    <input
                      className="trade-list-input-grizzlies"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-grizzlies trade-actions-td-grizzlies">
                    <div className="trade-list-actions-grizzlies">
                      <button
                        className="trade-list-btn-grizzlies trade-list-btn-save-grizzlies"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-grizzlies trade-list-btn-cancel-grizzlies"
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
        <div className="trade-add-button-container-grizzlies">
          <button
            className="trade-list-btn-grizzlies trade-list-btn-add-grizzlies"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListGrizzlies;
