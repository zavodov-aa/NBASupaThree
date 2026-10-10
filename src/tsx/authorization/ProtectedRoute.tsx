import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";

type Props = {
  children: ReactNode;
  roles?: string[]; // какие роли допускаются
  fallback?: ReactNode;
};

export default function ProtectedRoute({
  children,
  roles,
  fallback = null,
}: Props) {
  const { user, loading } = useAuth();
  const { openAuthModal } = useAuthModal();

  // Если не авторизован — открываем модалку
  useEffect(() => {
    if (!loading && !user) {
      openAuthModal({ reason: "protected" });
    }
  }, [loading, user, openAuthModal]);

  if (loading) return null;

  // Не авторизован — показываем fallback (модалка уже открыта)
  if (!user) return <>{fallback}</>;

  // Авторизован, но роли не хватает — ничего не открываем, просто заглушка
  if (roles && !roles.includes(user.role)) {
    return <p>Недостаточно прав для просмотра этой страницы</p>;
  }

  return <>{children}</>;
}
