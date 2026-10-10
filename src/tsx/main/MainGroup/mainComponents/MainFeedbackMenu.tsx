// components/FeedbackMenu.tsx
import React from "react";
import { FeedbackData } from "../MainTypes";

interface FeedbackMenuProps {
  show: boolean;
  feedbackData: FeedbackData;
  isSubmitting: boolean;
  submitMessage: string;
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: () => void;
}

const FeedbackMenu: React.FC<FeedbackMenuProps> = ({
  show,
  feedbackData,
  isSubmitting,
  submitMessage,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div className="feedback-menu" onClick={(e) => e.stopPropagation()}>
        <h3>Обратная связь</h3>
        <div className="feedback-form">
          <div className="form-group">
            <label htmlFor="date">Дата:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={feedbackData.date}
              onChange={onChange}
              className="form-input-feedback"
            />
          </div>

          <div className="form-group">
            <label htmlFor="errors">Ошибки:</label>
            <textarea
              id="errors"
              name="errors"
              value={feedbackData.errors}
              onChange={onChange}
              className="form-textarea-feedback"
              placeholder="Опишите найденные ошибки..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="offers">Предложения:</label>
            <textarea
              id="offers"
              name="offers"
              value={feedbackData.offers}
              onChange={onChange}
              className="form-textarea-feedback"
              placeholder="Ваши предложения по улучшению..."
              rows={4}
            />
          </div>

          {submitMessage && (
            <div
              className={`submit-message ${
                submitMessage.includes("ошибка") ? "error" : "success"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <div className="feedback-buttons">
            <button
              onClick={onSubmit}
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={onClose}
              className="close-btn"
              disabled={isSubmitting}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackMenu;
