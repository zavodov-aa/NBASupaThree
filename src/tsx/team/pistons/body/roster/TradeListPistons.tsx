import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListPistons.css";

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

const TradeListPistons = () => {
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
      .from("TradeList_Pistons")
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
      .from("TradeList_Pistons")
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
      .from("TradeList_Pistons")
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
      .from("TradeList_Pistons")
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
    <div className="trade-list-container-pistons">
      <div className="trade-header-content-pistons">
        <h1 className="trade-header-title-pistons">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-pistons">
        <div className="trade-table-wrapper-pistons">
          <table className="trade-list-table-pistons">
            <thead>
              <tr className="trade-table-header-pistons">
                <th className="trade-table-th-pistons">НА ОБМЕН</th>
                <th className="trade-table-th-pistons">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-pistons">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-pistons">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-pistons ${
                    index % 2 === 0
                      ? "trade-row-even-pistons"
                      : "trade-row-odd-pistons"
                  }`}
                >
                  <td className="trade-table-td-pistons">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-pistons"
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
                      <span className="trade-item-text-pistons">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-pistons">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-pistons"
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
                      <span className="trade-item-text-pistons">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-pistons trade-actions-td-pistons">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-pistons">
                        <button
                          className="trade-list-btn-pistons trade-list-btn-save-pistons"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-pistons trade-list-btn-cancel-pistons"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-pistons">
                        <button
                          className="trade-list-btn-pistons trade-list-btn-edit-pistons"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-pistons trade-list-btn-delete-pistons"
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
                <tr className="trade-table-row-pistons trade-row-adding-pistons">
                  <td className="trade-table-td-pistons">
                    <input
                      className="trade-list-input-pistons"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-pistons">
                    <input
                      className="trade-list-input-pistons"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-pistons trade-actions-td-pistons">
                    <div className="trade-list-actions-pistons">
                      <button
                        className="trade-list-btn-pistons trade-list-btn-save-pistons"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-pistons trade-list-btn-cancel-pistons"
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
        <div className="trade-add-button-container-pistons">
          <button
            className="trade-list-btn-pistons trade-list-btn-add-pistons"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListPistons;
