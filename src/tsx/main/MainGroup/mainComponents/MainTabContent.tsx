// components/TabContent.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TabType,
  Team,
  ConsoleItem,
  EventsLeague,
  MarketItem,
} from "../MainTypes";
import { supabase } from "../../../../Supabase";

interface TabContentProps {
  activeTab: TabType;
  teams: Team[];
  consoleCom: ConsoleItem[];
  eventsLeague: EventsLeague[];
  marketData: MarketItem[];
}

// Расширяем интерфейс Team для добавления img_path
type TeamWithImage = Team & {
  img_path?: string;
};

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  teams,
  consoleCom,
  eventsLeague,
  marketData,
}) => {
  const [teamsWithImages, setTeamsWithImages] = useState<TeamWithImage[]>([]);

  useEffect(() => {
    const fetchTeamImages = async () => {
      try {
        const { data: imgPaths, error } = await supabase
          .from("IMG_path")
          .select("*");

        if (error) {
          console.error("Error fetching image paths:", error);
          return;
        }

        console.log("Image paths from database:", imgPaths);

        const imgPathMap = new Map();
        imgPaths?.forEach((item: any) => {
          const teamName = item.team || item.team_name || item.name;
          const path = item.path || item.image_path || item.img_path;

          if (teamName && path) {
            imgPathMap.set(teamName.toLowerCase(), path);
          }
        });

        const updatedTeams = teams.map((team) => ({
          ...team,
          img_path: imgPathMap.get(team.name.toLowerCase()) || undefined,
        }));

        console.log("Updated teams with images:", updatedTeams);
        setTeamsWithImages(updatedTeams);
      } catch (error) {
        console.error("Error in fetchTeamImages:", error);
      }
    };

    if (teams.length > 0) {
      fetchTeamImages();
    }
  }, [teams]);

  const renderItems = <T extends { id: string; name: string; route?: string }>(
    items: T[],
    className: string,
    linkClassName: string,
    cardClassName: string,
  ) => (
    <div className={className}>
      {items.map((item) => {
        if (item.route) {
          return (
            <Link to={item.route} key={item.id} className={linkClassName}>
              <div className={cardClassName}>
                <h3>{item.name}</h3>
              </div>
            </Link>
          );
        }
        return (
          <div className={cardClassName} key={item.id}>
            <h3>{item.name}</h3>
          </div>
        );
      })}
    </div>
  );

  const darkenColor = (color: string, percent: number = 30): string => {
    if (!color) return "#2a2a4a";
    const hex = color.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.max(0, r - (r * percent) / 100);
    g = Math.max(0, g - (g * percent) / 100);
    b = Math.max(0, b - (b * percent) / 100);
    return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
  };

  // Функция для получения URL логотипа из папки public/img
  const getTeamLogoUrl = (imgPath?: string): string | null => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    const cleanPath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
    const logoUrl = `/img/${cleanPath}`;
    console.log(`Logo URL for ${imgPath}:`, logoUrl);
    return logoUrl;
  };

  const renderTeams = () => {
    if (teamsWithImages.length === 0 && teams.length > 0) {
      return <div>Загрузка логотипов...</div>;
    }

    const teamsToRender =
      teamsWithImages.length > 0 ? teamsWithImages : (teams as TeamWithImage[]);

    const eastTeams = teamsToRender
      .filter((team) => team.conference === "east")
      .sort((a, b) => a.name.localeCompare(b.name));

    const westTeams = teamsToRender
      .filter((team) => team.conference === "west")
      .sort((a, b) => a.name.localeCompare(b.name));

    const getTeamCardStyle = (team: TeamWithImage) => {
      const baseColor = team.color || "#2a2a4a";
      const softColor = darkenColor(baseColor, 40);
      return {
        backgroundColor: softColor,
        borderColor: baseColor,
        boxShadow: `0 2px 10px rgba(0, 0, 0, 0.2)`,
        transition: "all 0.3s ease",
      };
    };

    const TeamCard: React.FC<{ team: TeamWithImage }> = ({ team }) => {
      const logoUrl = getTeamLogoUrl(team.img_path);

      console.log(
        `Team: ${team.name}, path from DB: ${team.img_path}, final URL: ${logoUrl}`,
      );

      return (
        <div className="tab-team-card-content">
          {logoUrl ? (
            <div className="tab-team-logo-container">
              <img
                src={logoUrl}
                alt={`${team.name} logo`}
                className="tab-team-logo"
                onError={(e) => {
                  console.error(
                    `❌ Failed to load logo for ${team.name}:`,
                    logoUrl,
                  );
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const container = target.closest(".tab-team-logo-container");
                  if (container) {
                    const placeholder = document.createElement("div");
                    placeholder.className = "tab-team-logo-placeholder";
                    placeholder.innerHTML = `<span>${team.name.charAt(0)}</span>`;
                    container.appendChild(placeholder);
                  }
                }}
                onLoad={() => {
                  console.log(`✅ Logo loaded for ${team.name}`);
                }}
              />
            </div>
          ) : (
            <div className="tab-team-logo-placeholder">
              <span>{team.name.charAt(0)}</span>
            </div>
          )}
          <h3>{team.name}</h3>
          <span
            className="tab-team-color-dot"
            style={{ backgroundColor: team.color }}
          ></span>
        </div>
      );
    };

    return (
      <div className="teams-content">
        <div className="conference-section">
          <h2 className="conference-title">
            Восточная конференция
            <span className="conference-count">{eastTeams.length} команд</span>
          </h2>
          <div className="conference-teams-grid">
            {eastTeams.map((team) => {
              const cardStyle = getTeamCardStyle(team);

              if (team.route) {
                return (
                  <Link to={team.route} key={team.id} className="team-link">
                    <div
                      className="team-card"
                      style={cardStyle}
                      data-team-color={team.color}
                    >
                      <TeamCard team={team} />
                    </div>
                  </Link>
                );
              }
              return (
                <div
                  className="team-card"
                  key={team.id}
                  style={cardStyle}
                  data-team-color={team.color}
                >
                  <TeamCard team={team} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="conference-section">
          <h2 className="conference-title">
            Западная конференция
            <span className="conference-count">{westTeams.length} команд</span>
          </h2>
          <div className="conference-teams-grid">
            {westTeams.map((team) => {
              const cardStyle = getTeamCardStyle(team);

              if (team.route) {
                return (
                  <Link to={team.route} key={team.id} className="team-link">
                    <div
                      className="team-card"
                      style={cardStyle}
                      data-team-color={team.color}
                    >
                      <TeamCard team={team} />
                    </div>
                  </Link>
                );
              }
              return (
                <div
                  className="team-card"
                  key={team.id}
                  style={cardStyle}
                  data-team-color={team.color}
                >
                  <TeamCard team={team} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  switch (activeTab) {
    case "teams":
      return renderTeams();
    case "console":
      return renderItems(
        consoleCom,
        "console-content",
        "console-link",
        "console-card",
      );
    case "reserve":
      return renderItems(
        eventsLeague,
        "reserve-content",
        "reserve-link",
        "reserve-card",
      );
    case "market":
      return renderItems(
        marketData,
        "market-content",
        "market-link",
        "market-card",
      );
    default:
      return null;
  }
};

export default TabContent;
