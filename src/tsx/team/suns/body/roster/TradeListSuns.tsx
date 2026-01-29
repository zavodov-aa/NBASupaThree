import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListSuns.css";

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

const TradeListSuns = () => {
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
      .from("TradeList_Suns")
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

    const { error } = await supabase.from("TradeList_Suns").insert([newTrade]);

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
      .from("TradeList_Suns")
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
      .from("TradeList_Suns")
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
    <div className="trade-list-container-suns">
      <div className="trade-header-content-suns">
        <h1 className="trade-header-title-suns">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-suns">
        <div className="trade-table-wrapper-suns">
          <table className="trade-list-table-suns">
            <thead>
              <tr className="trade-table-header-suns">
                <th className="trade-table-th-suns">НА ОБМЕН</th>
                <th className="trade-table-th-suns">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-suns">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-suns">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-suns ${
                    index % 2 === 0
                      ? "trade-row-even-suns"
                      : "trade-row-odd-suns"
                  }`}
                >
                  <td className="trade-table-td-suns">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-suns"
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
                      <span className="trade-item-text-suns">{trade.give}</span>
                    )}
                  </td>
                  <td className="trade-table-td-suns">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-suns"
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
                      <span className="trade-item-text-suns">{trade.want}</span>
                    )}
                  </td>
                  <td className="trade-table-td-suns trade-actions-td-suns">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-suns">
                        <button
                          className="trade-list-btn-suns trade-list-btn-save-suns"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-suns trade-list-btn-cancel-suns"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-suns">
                        <button
                          className="trade-list-btn-suns trade-list-btn-edit-suns"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-suns trade-list-btn-delete-suns"
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
                <tr className="trade-table-row-suns trade-row-adding-suns">
                  <td className="trade-table-td-suns">
                    <input
                      className="trade-list-input-suns"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-suns">
                    <input
                      className="trade-list-input-suns"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-suns trade-actions-td-suns">
                    <div className="trade-list-actions-suns">
                      <button
                        className="trade-list-btn-suns trade-list-btn-save-suns"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-suns trade-list-btn-cancel-suns"
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
        <div className="trade-add-button-container-suns">
          <button
            className="trade-list-btn-suns trade-list-btn-add-suns"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListSuns;
