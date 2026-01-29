import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListSpurs.css";

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

const TradeListSpurs = () => {
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
      .from("TradeList_Spurs")
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

    const { error } = await supabase.from("TradeList_Spurs").insert([newTrade]);

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
      .from("TradeList_Spurs")
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
      .from("TradeList_Spurs")
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
    return (
      <div className="trade-loading-text-spurs">Loading Trade List...</div>
    );
  }

  return (
    <div className="trade-list-container-spurs">
      <div className="trade-header-content-spurs">
        <h1 className="trade-header-title-spurs">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-spurs">
        <div className="trade-table-wrapper-spurs">
          <table className="trade-list-table-spurs">
            <thead>
              <tr className="trade-table-header-spurs">
                <th className="trade-table-th-spurs">НА ОБМЕН</th>
                <th className="trade-table-th-spurs">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-spurs">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-spurs">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-spurs ${
                    index % 2 === 0
                      ? "trade-row-even-spurs"
                      : "trade-row-odd-spurs"
                  }`}
                >
                  <td className="trade-table-td-spurs">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-spurs"
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
                      <span className="trade-item-text-spurs">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-spurs">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-spurs"
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
                      <span className="trade-item-text-spurs">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-spurs trade-actions-td-spurs">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-spurs">
                        <button
                          className="trade-list-btn-spurs trade-list-btn-save-spurs"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-spurs trade-list-btn-cancel-spurs"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-spurs">
                        <button
                          className="trade-list-btn-spurs trade-list-btn-edit-spurs"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-spurs trade-list-btn-delete-spurs"
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
                <tr className="trade-table-row-spurs trade-row-adding-spurs">
                  <td className="trade-table-td-spurs">
                    <input
                      className="trade-list-input-spurs"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-spurs">
                    <input
                      className="trade-list-input-spurs"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-spurs trade-actions-td-spurs">
                    <div className="trade-list-actions-spurs">
                      <button
                        className="trade-list-btn-spurs trade-list-btn-save-spurs"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-spurs trade-list-btn-cancel-spurs"
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
        <div className="trade-add-button-container-spurs">
          <button
            className="trade-list-btn-spurs trade-list-btn-add-spurs"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListSpurs;
