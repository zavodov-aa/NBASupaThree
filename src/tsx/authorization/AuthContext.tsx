import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../Supabase";

export type User = {
  id: number;
  team: string;
  role: string;
};

type LoginResult =
  | { success: true; user: User }
  | { success: false; error: string };

type ChangePasswordResult =
  | { success: true }
  | { success: false; error: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  changePassword: (
    team: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<ChangePasswordResult>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Восстанавливаем пользователя из localStorage при загрузке
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    loginValue: string,
    password: string,
  ): Promise<LoginResult> => {
    const { data, error } = await supabase
      .from("Pass_team")
      .select("id, team, role")
      .eq("team", loginValue)
      .eq("pass", password)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: "Неверный логин или пароль" };
    }

    const authUser: User = data;
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

    return { success: true, user: authUser };
  };

  const changePassword = async (
    team: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<ChangePasswordResult> => {
    if (!team) {
      return { success: false, error: "Команда не выбрана" };
    }
    if (!oldPassword) {
      return { success: false, error: "Введите текущий пароль" };
    }
    if (!newPassword || newPassword.length < 3) {
      return {
        success: false,
        error: "Пароль должен быть не короче 4 символов",
      };
    }
    if (oldPassword === newPassword) {
      return {
        success: false,
        error: "Новый пароль должен отличаться от старого",
      };
    }

    // 1. Проверяем, что старый пароль верный
    const { data: existing, error: checkError } = await supabase
      .from("Pass_team")
      .select("id")
      .eq("team", team)
      .eq("pass", oldPassword)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: checkError.message };
    }
    if (!existing) {
      return { success: false, error: "Неверный текущий пароль" };
    }

    // 2. Обновляем пароль
    const { data, error } = await supabase
      .from("Pass_team")
      .update({ pass: newPassword })
      .eq("team", team)
      .select("id")
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: "Команда не найдена" };
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
