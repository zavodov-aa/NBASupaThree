import { useState, FormEvent, useEffect, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";
import "./authModal.css";

// Список доступных логинов. Замени на свои данные
// (например, приходящие с API через useEffect).
const AVAILABLE_LOGINS = [
  "Commissioner",
  "Lakers",
  "Bulls",
  "Jazz",
  "Hawks",
  "Celtics",
  "Nets",
  "Hornets",
  "Cavaliers",
  "Mavericks",
  "Nuggets",
  "Pistons",
  "Warriors",
  "Rockets",
  "Pacers",
  "Clippers",
  "Grizzlies",
  "Heat",
  "Bucks",
  "Timberwolves",
  "Pelicans",
  "Knicks",
  "Thunder",
  "Magic",
  "76ers",
  "Suns",
  "Blazers",
  "Kings",
  "Spurs",
  "Raptors",
  "Wizards",
  "test",
];

export default function AuthModal() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Состояние для смены пароля
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState(""); // ← новое
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // Состояние для combobox
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const auth = useAuth();
  const { isOpen, options, closeAuthModal } = useAuthModal();

  // Сбрасываем форму при открытии/закрытии
  useEffect(() => {
    if (isOpen) {
      setLogin("");
      setPassword("");
      setError("");
      setLoading(false);
      setSearch("");
      setIsDropdownOpen(false);
      setHighlightedIndex(0);
      setIsChangingPassword(false);
      setOldPassword(""); // ← новое
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordMessage("");
      setChangePasswordError("");
      setChangePasswordLoading(false);
    }
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else if (isChangingPassword) {
          setIsChangingPassword(false);
          setOldPassword(""); // ← новое
          setNewPassword("");
          setConfirmPassword("");
          setChangePasswordMessage("");
          setChangePasswordError("");
        } else {
          closeAuthModal();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeAuthModal, isDropdownOpen, isChangingPassword]);

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    if (!isDropdownOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isDropdownOpen]);

  // Фильтрация логинов по поисковой строке
  const filteredLogins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return AVAILABLE_LOGINS;
    return AVAILABLE_LOGINS.filter((item) => item.toLowerCase().includes(q));
  }, [search]);

  if (!isOpen) return null;

  const handleSelectLogin = (value: string) => {
    setLogin(value);
    setSearch(value);
    setIsDropdownOpen(false);
    setError("");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await auth.login(login, password);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    closeAuthModal();
    options.onSuccess?.();
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordMessage("");

    // Проверка, что старый пароль введён
    if (!oldPassword) {
      setChangePasswordError("Введите текущий пароль");
      return;
    }
    if (newPassword.length < 3) {
      setChangePasswordError("Пароль должен быть не короче 4 символов");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError("Пароли не совпадают");
      return;
    }
    if (oldPassword === newPassword) {
      setChangePasswordError("Новый пароль должен отличаться от старого");
      return;
    }

    setChangePasswordLoading(true);

    try {
      // Если в AuthContext есть метод changePassword — используем его.
      // Иначе — заглушка, которую нужно заменить на реальный вызов API.
      if (typeof (auth as any).changePassword === "function") {
        const result = await (auth as any).changePassword(
          login,
          oldPassword, // ← передаём старый пароль
          newPassword,
        );
        if (!result?.success) {
          setChangePasswordError(result?.error ?? "Не удалось изменить пароль");
          return;
        }
      } else {
        // TODO: заменить на реальный вызов API
        await new Promise((r) => setTimeout(r, 500));
      }

      setChangePasswordMessage("Пароль успешно изменён");
      setOldPassword(""); // ← очищаем
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setChangePasswordError("Произошла ошибка при смене пароля");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const cancelChangePassword = () => {
    setIsChangingPassword(false);
    setOldPassword(""); // ← новое
    setNewPassword("");
    setConfirmPassword("");
    setChangePasswordMessage("");
    setChangePasswordError("");
  };

  return (
    <div className="auth-overlay" onClick={closeAuthModal}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="auth-modal__close"
          onClick={closeAuthModal}
          aria-label="Закрыть"
        >
          ✕
        </button>

        {!isChangingPassword ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 id="auth-modal-title" className="auth-form__title">
              Вход
            </h1>

            {/* Combobox для выбора логина */}
            <div className="auth-form__field" ref={comboboxRef}>
              <div className="auth-combobox">
                <input
                  className="auth-form__input auth-combobox__input"
                  placeholder="Логин"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setLogin(e.target.value);
                    setIsDropdownOpen(true);
                    setHighlightedIndex(0);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setIsDropdownOpen(true);
                      setHighlightedIndex((i) =>
                        Math.min(i + 1, filteredLogins.length - 1),
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && isDropdownOpen) {
                      e.preventDefault();
                      const picked = filteredLogins[highlightedIndex];
                      if (picked) handleSelectLogin(picked);
                    }
                  }}
                  required
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="auth-combobox__toggle"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  aria-label="Открыть список"
                  tabIndex={-1}
                >
                  ▾
                </button>

                {isDropdownOpen && (
                  <ul className="auth-combobox__list" role="listbox">
                    {filteredLogins.length === 0 ? (
                      <li className="auth-combobox__empty">
                        Ничего не найдено
                      </li>
                    ) : (
                      filteredLogins.map((item, idx) => (
                        <li
                          key={item}
                          role="option"
                          aria-selected={login === item}
                          className={
                            "auth-combobox__option" +
                            (idx === highlightedIndex
                              ? " auth-combobox__option--highlighted"
                              : "") +
                            (login === item
                              ? " auth-combobox__option--selected"
                              : "")
                          }
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onMouseDown={(e) => {
                            // preventDefault чтобы не терять фокус до клика
                            e.preventDefault();
                            handleSelectLogin(item);
                          }}
                        >
                          {item}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="auth-form__field">
              <input
                className="auth-form__input"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {login && (
                <button
                  type="button"
                  className="auth-form__link-button"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setError("");
                  }}
                >
                  Изменить пароль
                </button>
              )}
            </div>

            {error && <p className="auth-form__error">{error}</p>}

            <button
              type="submit"
              className="auth-form__submit"
              disabled={loading}
            >
              {loading ? "Проверяем..." : "Войти"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleChangePassword}>
            <h1 id="auth-modal-title" className="auth-form__title">
              Смена пароля
            </h1>

            <p className="auth-form__hint">
              Команда: <strong>{login}</strong>
            </p>

            {/* Поле для текущего (старого) пароля */}
            <div className="auth-form__field">
              <input
                className="auth-form__input"
                type="password"
                placeholder="Текущий пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                autoFocus
                autoComplete="current-password"
              />
            </div>

            <div className="auth-form__field">
              <input
                className="auth-form__input"
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="auth-form__field">
              <input
                className="auth-form__input"
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {changePasswordError && (
              <p className="auth-form__error">{changePasswordError}</p>
            )}
            {changePasswordMessage && (
              <p className="auth-form__success">{changePasswordMessage}</p>
            )}

            <div className="auth-form__actions">
              <button
                type="button"
                className="auth-form__link-button"
                onClick={cancelChangePassword}
                disabled={changePasswordLoading}
              >
                Назад
              </button>
              <button
                type="submit"
                className="auth-form__submit"
                disabled={changePasswordLoading}
              >
                {changePasswordLoading ? "Сохраняем..." : "Сохранить пароль"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
