import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListBulls.css";

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

const TradeListBulls = () => {
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
      .from("TradeList_Bulls")
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

    const { error } = await supabase.from("TradeList_Bulls").insert([newTrade]);

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
      .from("TradeList_Bulls")
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
      .from("TradeList_Bulls")
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
      <div className="trade-loading-text-bulls">Loading Trade List...</div>
    );
  }

  return (
    <div className="trade-list-container-bulls">
      <div className="trade-header-content-bulls">
        <h1 className="trade-header-title-bulls">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-bulls">
        <div className="trade-table-wrapper-bulls">
          <table className="trade-list-table-bulls">
            <thead>
              <tr className="trade-table-header-bulls">
                <th className="trade-table-th-bulls">НА ОБМЕН</th>
                <th className="trade-table-th-bulls">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-bulls">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-bulls">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-bulls ${
                    index % 2 === 0
                      ? "trade-row-even-bulls"
                      : "trade-row-odd-bulls"
                  }`}
                >
                  <td className="trade-table-td-bulls">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-bulls"
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
                      <span className="trade-item-text-bulls">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-bulls">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-bulls"
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
                      <span className="trade-item-text-bulls">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-bulls trade-actions-td-bulls">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-bulls">
                        <button
                          className="trade-list-btn-bulls trade-list-btn-save-bulls"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-bulls trade-list-btn-cancel-bulls"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-bulls">
                        <button
                          className="trade-list-btn-bulls trade-list-btn-edit-bulls"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-bulls trade-list-btn-delete-bulls"
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
                <tr className="trade-table-row-bulls trade-row-adding-bulls">
                  <td className="trade-table-td-bulls">
                    <input
                      className="trade-list-input-bulls"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-bulls">
                    <input
                      className="trade-list-input-bulls"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-bulls trade-actions-td-bulls">
                    <div className="trade-list-actions-bulls">
                      <button
                        className="trade-list-btn-bulls trade-list-btn-save-bulls"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-bulls trade-list-btn-cancel-bulls"
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
        <div className="trade-add-button-container-bulls">
          <button
            className="trade-list-btn-bulls trade-list-btn-add-bulls"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListBulls;
