import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./tradeListSevsix.css";

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

const TradeListSevsix = () => {
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
      .from("TradeList_76ers")
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

    const { error } = await supabase.from("TradeList_76ers").insert([newTrade]);

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
      .from("TradeList_76ers")
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
      .from("TradeList_76ers")
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
    <div className="trade-list-container-sevsix">
      <div className="trade-header-content-sevsix">
        <h1 className="trade-header-title-sevsix">TRADE LIST</h1>
      </div>

      <div className="trade-table-container-sevsix">
        <div className="trade-table-wrapper-sevsix">
          <table className="trade-list-table-sevsix">
            <thead>
              <tr className="trade-table-header-sevsix">
                <th className="trade-table-th-sevsix">НА ОБМЕН</th>
                <th className="trade-table-th-sevsix">СПИСОК ЖЕЛАЕМОГО</th>
                <th className="trade-table-th-sevsix">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="trade-table-body-sevsix">
              {trades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`trade-table-row-sevsix ${
                    index % 2 === 0
                      ? "trade-row-even-sevsix"
                      : "trade-row-odd-sevsix"
                  }`}
                >
                  <td className="trade-table-td-sevsix">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-sevsix"
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
                      <span className="trade-item-text-sevsix">
                        {trade.give}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-sevsix">
                    {editingId === trade.id ? (
                      <input
                        className="trade-list-input-sevsix"
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
                      <span className="trade-item-text-sevsix">
                        {trade.want}
                      </span>
                    )}
                  </td>
                  <td className="trade-table-td-sevsix trade-actions-td-sevsix">
                    {editingId === trade.id ? (
                      <div className="trade-list-actions-sevsix">
                        <button
                          className="trade-list-btn-sevsix trade-list-btn-save-sevsix"
                          onClick={() => handleUpdate(trade.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="trade-list-btn-sevsix trade-list-btn-cancel-sevsix"
                          onClick={cancelEdit}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="trade-list-actions-sevsix">
                        <button
                          className="trade-list-btn-sevsix trade-list-btn-edit-sevsix"
                          onClick={() => setEditingId(trade.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="trade-list-btn-sevsix trade-list-btn-delete-sevsix"
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
                <tr className="trade-table-row-sevsix trade-row-adding-sevsix">
                  <td className="trade-table-td-sevsix">
                    <input
                      className="trade-list-input-sevsix"
                      value={newTrade.give}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, give: e.target.value })
                      }
                      placeholder="Введите что отдаете"
                    />
                  </td>
                  <td className="trade-table-td-sevsix">
                    <input
                      className="trade-list-input-sevsix"
                      value={newTrade.want}
                      onChange={(e) =>
                        setNewTrade({ ...newTrade, want: e.target.value })
                      }
                      placeholder="Введите что хотите"
                    />
                  </td>
                  <td className="trade-table-td-sevsix trade-actions-td-sevsix">
                    <div className="trade-list-actions-sevsix">
                      <button
                        className="trade-list-btn-sevsix trade-list-btn-save-sevsix"
                        onClick={handleSave}
                      >
                        Сохранить
                      </button>
                      <button
                        className="trade-list-btn-sevsix trade-list-btn-cancel-sevsix"
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
        <div className="trade-add-button-container-sevsix">
          <button
            className="trade-list-btn-sevsix trade-list-btn-add-sevsix"
            onClick={() => setIsAdding(true)}
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeListSevsix;
