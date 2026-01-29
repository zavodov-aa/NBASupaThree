import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListNets.css";

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

const TradeListNets = () => {
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
      .from("TradeList_Nets")
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

    const { error } = await supabase.from("TradeList_Nets").insert([newTrade]);

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
      .from("TradeList_Nets")
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
      .from("TradeList_Nets")
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
    <div className="trade-list-container-nets">
      <div className="trade-header-content-nets">
        <h1 className="trade-header-title-nets">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-nets">
        <div className="trade-table-wrapper-nets">
          <table className="trade-list-table-nets">
            <thead>
              <tr className="trade-table-header-nets">
                <th className="trade-table-th-nets">НА ОБМЕН</th>
                <th className="trade-table-th-nets">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-nets">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-nets">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-nets ${
                    index % 2 === 0
                      ? "trade-row-even-nets"
                      : "trade-row-odd-nets"
                  }`}
                >
                  <td className="trade-table-td-nets">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-nets"
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
                      <span className="trade-item-text-nets">{trade.give}</span>
                    )}
                  </td>
                  <td className="trade-table-td-nets">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-nets"
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
                      <span className="trade-item-text-nets">{trade.want}</span>
                    )}
                  </td>
                  <td className="trade-table-td-nets trade-actions-td-nets">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-nets">
                        <button
                          className="trade-list-btn-nets trade-list-btn-save-nets"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-nets trade-list-btn-cancel-nets"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-nets">
                        <button
                          className="trade-list-btn-nets trade-list-btn-edit-nets"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-nets trade-list-btn-delete-nets"
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
                <tr className="trade-table-row-nets trade-row-adding-nets">
                  <td className="trade-table-td-nets">
                    <input
                      className="trade-list-input-nets"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-nets">
                    <input
                      className="trade-list-input-nets"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-nets trade-actions-td-nets">
                    <div className="trade-list-actions-nets">
                      <button
                        className="trade-list-btn-nets trade-list-btn-save-nets"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-nets trade-list-btn-cancel-nets"
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
        <div className="trade-add-button-container-nets">
          <button
            className="trade-list-btn-nets trade-list-btn-add-nets"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListNets;
