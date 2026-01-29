import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListPacers.css";

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

const TradeListPacers = () => {
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
      .from("TradeList_Pacers")
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
      .from("TradeList_Pacers")
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
      .from("TradeList_Pacers")
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
      .from("TradeList_Pacers")
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
    <div className="trade-list-container-pacers">
      <div className="trade-header-content-pacers">
        <h1 className="trade-header-title-pacers">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-pacers">
        <div className="trade-table-wrapper-pacers">
          <table className="trade-list-table-pacers">
            <thead>
              <tr className="trade-table-header-pacers">
                <th className="trade-table-th-pacers">НА ОБМЕН</th>
                <th className="trade-table-th-pacers">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-pacers">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-pacers">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-pacers ${
                    index % 2 === 0
                      ? "trade-row-even-pacers"
                      : "trade-row-odd-pacers"
                  }`}
                >
                  <td className="trade-table-td-pacers">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-pacers"
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
                      <span className="trade-item-text-pacers">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-pacers">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-pacers"
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
                      <span className="trade-item-text-pacers">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-pacers trade-actions-td-pacers">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-pacers">
                        <button
                          className="trade-list-btn-pacers trade-list-btn-save-pacers"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-pacers trade-list-btn-cancel-pacers"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-pacers">
                        <button
                          className="trade-list-btn-pacers trade-list-btn-edit-pacers"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-pacers trade-list-btn-delete-pacers"
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
                <tr className="trade-table-row-pacers trade-row-adding-pacers">
                  <td className="trade-table-td-pacers">
                    <input
                      className="trade-list-input-pacers"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-pacers">
                    <input
                      className="trade-list-input-pacers"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-pacers trade-actions-td-pacers">
                    <div className="trade-list-actions-pacers">
                      <button
                        className="trade-list-btn-pacers trade-list-btn-save-pacers"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-pacers trade-list-btn-cancel-pacers"
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
        <div className="trade-add-button-container-pacers">
          <button
            className="trade-list-btn-pacers trade-list-btn-add-pacers"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListPacers;
