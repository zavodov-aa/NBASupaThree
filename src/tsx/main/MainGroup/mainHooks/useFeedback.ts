// hooks/useFeedback.ts
import { useState } from "react";
import { supabase } from "../../../../Supabase";
import { FeedbackData } from "../MainTypes";

export const useFeedback = () => {
  const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    date: "",
    errors: "",
    offers: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackData.date) {
      setSubmitMessage("Пожалуйста, заполните поле даты");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const { data, error } = await supabase.from("Questions").insert([
        {
          date: feedbackData.date,
          errors: feedbackData.errors || null,
          offers: feedbackData.offers || null,
        },
      ]);

      if (error) {
        console.error("Ошибка Supabase:", error);
        if (error.code === "42501") {
          throw new Error(
            "Ошибка прав доступа. Проверьте RLS политики в Supabase.",
          );
        } else if (error.code === "42P01") {
          throw new Error(
            'Таблица "Questions" не найдена. Создайте ее в Supabase.',
          );
        } else if (error.message.includes("JWT")) {
          throw new Error(
            "Неверный API ключ. Проверьте REACT_APP_SUPABASE_ANON_KEY.",
          );
        } else {
          throw error;
        }
      }

      console.log("✅ Данные успешно отправлены:", data);
      setSubmitMessage("✅ Спасибо! Ваш отзыв сохранен.");

      setTimeout(() => {
        setFeedbackData({ date: "", errors: "", offers: "" });
        setShowFeedbackMenu(false);
        setSubmitMessage("");
      }, 2000);
    } catch (error: any) {
      console.error("Полная ошибка:", error);
      let errorMessage = "Произошла ошибка при сохранении";
      if (error.message.includes("RLS")) {
        errorMessage =
          "Ошибка доступа. Проверьте RLS политики в Supabase Dashboard.";
      } else if (error.message.includes("Таблица")) {
        errorMessage =
          "Таблица не найдена. Создайте таблицу 'Questions' в Supabase.";
      } else if (error.message.includes("API ключ")) {
        errorMessage =
          "Проблема с API ключом. Проверьте настройки в файле .env";
      }
      setSubmitMessage(`❌ ${errorMessage}`);
      setTimeout(() => setSubmitMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseMenu = () => {
    setShowFeedbackMenu(false);
    setFeedbackData({ date: "", errors: "", offers: "" });
    setSubmitMessage("");
  };

  const handleOpenMenu = () => {
    setShowFeedbackMenu(true);
  };

  return {
    showFeedbackMenu,
    feedbackData,
    isSubmitting,
    submitMessage,
    handleInputChange,
    handleSubmitFeedback,
    handleCloseMenu,
    handleOpenMenu,
  };
};
