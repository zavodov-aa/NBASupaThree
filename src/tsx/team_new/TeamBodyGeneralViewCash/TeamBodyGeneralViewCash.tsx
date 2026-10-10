import React, { useState } from "react";
import { supabase } from "../../../Supabase";
import "./teamBodyGeneralViewCash.css";

interface CashData {
  team_name: string;
  cash_money: number;
}

interface TeamCashModalProps {
  teamName: string;
}

const TeamBodyGeneralViewCash: React.FC<TeamCashModalProps> = ({
  teamName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cashData, setCashData] = useState<CashData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCash = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("Head")
        .select("team_name, cash_money")
        .eq("team_name", teamName)
        .single();

      if (supabaseError) throw supabaseError;
      setCashData(data as CashData | null);
    } catch (err) {
      console.error("Ошибка загрузки Cash:", err);
      setError("Не удалось загрузить данные о cash");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchCash();
  };

  const closeModal = () => {
    setIsOpen(false);
    setCashData(null);
    setError(null);
  };

  return (
    <>
      <button className="general-cash-button" onClick={openModal}>
        Cash
      </button>

      {isOpen && (
        <div className="general-cash-modal-overlay" onClick={closeModal}>
          <div
            className="general-cash-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="general-cash-modal-header">
              <h2 className="general-cash-modal-title">
                Cash команды {teamName}
              </h2>
              <button className="general-cash-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="general-cash-modal-content">
              {loading && (
                <div className="general-cash-loading-state">
                  <div className="general-cash-spinner"></div>
                  <p>Загрузка данных...</p>
                </div>
              )}

              {error && <div className="general-cash-error-state">{error}</div>}

              {!loading && !error && (
                <>
                  {!cashData ? (
                    <div className="general-cash-empty-state">
                      Данные не найдены для команды "{teamName}"
                    </div>
                  ) : (
                    <div className="general-cash-info-block">
                      <div className="general-cash-info-row">
                        <span className="general-cash-info-label">
                          Команда:
                        </span>
                        <span className="general-cash-info-value">
                          {cashData.team_name}
                        </span>
                      </div>
                      <div className="general-cash-info-row">
                        <span className="general-cash-info-label">
                          Сумма Cash:
                        </span>
                        <span className="general-cash-info-value">
                          {cashData.cash_money} $
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="general-cash-modal-footer">
              Финансовая информация
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamBodyGeneralViewCash;
