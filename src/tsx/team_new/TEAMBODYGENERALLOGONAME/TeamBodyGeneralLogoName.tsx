import React, { useEffect, useState } from "react";
import { supabase } from "../../../Supabase";
import "./teamBodyGeneralLogoName.css";
import { useTeamColor } from "./useTeamColor"; // путь к хуку

interface TeamBodyGeneralProps {
  teamName: string;
  className?: string;
  alt?: string;
  titleColor?: string; // новый пропс
}

const TeamBodyGeneralLogoName: React.FC<TeamBodyGeneralProps> = ({
  teamName,
  className,
  alt,
  titleColor: propTitleColor,
}) => {
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Получаем цвет из хука, если пропс не передан
  const hookColor = useTeamColor(teamName);
  const titleColor = propTitleColor || hookColor;

  useEffect(() => {
    const fetchLogo = async () => {
      if (!teamName) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("IMG_path")
          .select("path")
          .eq("team", teamName)
          .single();

        if (error) throw error;
        console.log("Загруженный путь:", data?.path);
        setLogoPath(data?.path || null);
      } catch (err: unknown) {
        console.error("Ошибка загрузки логотипа:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [teamName]);

  if (loading) return <div className="tbg-loading">Загрузка логотипа...</div>;
  if (error) return <div className="tbg-error">Ошибка: {error}</div>;
  if (!logoPath)
    return (
      <div className="tbg-notFound">
        Логотип для команды "{teamName}" не найден
      </div>
    );

  const normalizedPath = (() => {
    if (logoPath.includes("/")) {
      return logoPath.startsWith("/") ? logoPath : `/${logoPath}`;
    }
    return `/img/${logoPath}`;
  })();
  const imageAlt = alt || `Логотип команды ${teamName}`;

  // Устанавливаем CSS-переменную для цвета заголовка
  const titleStyle = {
    "--team-title-color": titleColor,
  } as React.CSSProperties;

  return (
    <div className={`tbg-container ${className || ""}`}>
      <img src={normalizedPath} alt={imageAlt} className="tbg-logo" />
      <span className="tbg-teamName" style={titleStyle}>
        {teamName}
      </span>
    </div>
  );
};

export default TeamBodyGeneralLogoName;
