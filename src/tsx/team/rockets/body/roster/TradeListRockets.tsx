import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListRockets.css";

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

const TradeListRockets = () => {
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
      .from("TradeList_Rockets")
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
      .from("TradeList_Rockets")
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
      .from("TradeList_Rockets")
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
      .from("TradeList_Rockets")
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
    <div className="trade-list-container-rockets">
      <div className="trade-header-content-rockets">
        <h1 className="trade-header-title-rockets">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-rockets">
        <div className="trade-table-wrapper-rockets">
          <table className="trade-list-table-rockets">
            <thead>
              <tr className="trade-table-header-rockets">
                <th className="trade-table-th-rockets">НА ОБМЕН</th>
                <th className="trade-table-th-rockets">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-rockets">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-rockets">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-rockets ${
                    index % 2 === 0
                      ? "trade-row-even-rockets"
                      : "trade-row-odd-rockets"
                  }`}
                >
                  <td className="trade-table-td-rockets">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-rockets"
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
                      <span className="trade-item-text-rockets">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-rockets">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-rockets"
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
                      <span className="trade-item-text-rockets">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-rockets trade-actions-td-rockets">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-rockets">
                        <button
                          className="trade-list-btn-rockets trade-list-btn-save-rockets"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-rockets trade-list-btn-cancel-rockets"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-rockets">
                        <button
                          className="trade-list-btn-rockets trade-list-btn-edit-rockets"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-rockets trade-list-btn-delete-rockets"
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
                <tr className="trade-table-row-rockets trade-row-adding-rockets">
                  <td className="trade-table-td-rockets">
                    <input
                      className="trade-list-input-rockets"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-rockets">
                    <input
                      className="trade-list-input-rockets"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-rockets trade-actions-td-rockets">
                    <div className="trade-list-actions-rockets">
                      <button
                        className="trade-list-btn-rockets trade-list-btn-save-rockets"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-rockets trade-list-btn-cancel-rockets"
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
        <div className="trade-add-button-container-rockets">
          <button
            className="trade-list-btn-rockets trade-list-btn-add-rockets"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListRockets;
