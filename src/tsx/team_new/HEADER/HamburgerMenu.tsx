// import React, { useEffect } from "react";
// import "./headerAll.css"; // стили можно добавить сюда же

// // Список всех 30 команд НБА
// const NBA_TEAMS = [
//   "Atlanta Hawks",
//   "Boston Celtics",
//   "Brooklyn Nets",
//   "Charlotte Hornets",
//   "Chicago Bulls",
//   "Cleveland Cavaliers",
//   "Dallas Mavericks",
//   "Denver Nuggets",
//   "Detroit Pistons",
//   "Golden State Warriors",
//   "Houston Rockets",
//   "Indiana Pacers",
//   "Los Angeles Clippers",
//   "Los Angeles Lakers",
//   "Memphis Grizzlies",
//   "Miami Heat",
//   "Milwaukee Bucks",
//   "Minnesota Timberwolves",
//   "New Orleans Pelicans",
//   "New York Knicks",
//   "Oklahoma City Thunder",
//   "Orlando Magic",
//   "Philadelphia 76ers",
//   "Phoenix Suns",
//   "Portland Trail Blazers",
//   "Sacramento Kings",
//   "San Antonio Spurs",
//   "Toronto Raptors",
//   "Utah Jazz",
//   "Washington Wizards",
// ];

// interface HamburgerMenuProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
//   // Закрытие по клавише Escape
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     if (isOpen) {
//       window.addEventListener("keydown", handleEsc);
//     }
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="ha-fullscreen-menu">
//       <div className="ha-menu-content">
//         <button
//           className="ha-menu-close"
//           onClick={onClose}
//           aria-label="Закрыть меню"
//         >
//           ✕
//         </button>
//         <h2 className="ha-menu-title">Команды НБА</h2>
//         <ul className="ha-team-list">
//           {NBA_TEAMS.map((team) => (
//             <li key={team} className="ha-team-item">
//               {team}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default HamburgerMenu;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./headerAll.css";

const NBA_TEAMS = [
  "Atlanta Hawks",
  "Boston Celtics",
  "Brooklyn Nets",
  "Charlotte Hornets",
  "Chicago Bulls",
  "Cleveland Cavaliers",
  "Dallas Mavericks",
  "Denver Nuggets",
  "Detroit Pistons",
  "Golden State Warriors",
  "Houston Rockets",
  "Indiana Pacers",
  "Los Angeles Clippers",
  "Los Angeles Lakers",
  "Memphis Grizzlies",
  "Miami Heat",
  "Milwaukee Bucks",
  "Minnesota Timberwolves",
  "New Orleans Pelicans",
  "New York Knicks",
  "Oklahoma City Thunder",
  "Orlando Magic",
  "Philadelphia 76ers",
  "Phoenix Suns",
  "Portland Trail Blazers",
  "Sacramento Kings",
  "San Antonio Spurs",
  "Toronto Raptors",
  "Utah Jazz",
  "Washington Wizards",
];

const teamPathMap: Record<string, string> = {
  "Atlanta Hawks": "hawksMain",
  "Boston Celtics": "celticsMain",
  "Brooklyn Nets": "netsMain",
  "Charlotte Hornets": "hornetsMain",
  "Chicago Bulls": "bullsMain",
  "Cleveland Cavaliers": "cavaliersMain",
  "Dallas Mavericks": "mavericksMain",
  "Denver Nuggets": "nuggetsMain",
  "Detroit Pistons": "pistonsMain",
  "Golden State Warriors": "warriorsMain",
  "Houston Rockets": "rocketsMain",
  "Indiana Pacers": "pacersMain",
  "Los Angeles Clippers": "clippersMain",
  "Los Angeles Lakers": "lakersMain",
  "Memphis Grizzlies": "grizzliesMain",
  "Miami Heat": "heatMain",
  "Milwaukee Bucks": "bucksMain",
  "Minnesota Timberwolves": "timberwolvesMain",
  "New Orleans Pelicans": "pelicansMain",
  "New York Knicks": "knicksMain",
  "Oklahoma City Thunder": "thunderMain",
  "Orlando Magic": "magicMain",
  "Philadelphia 76ers": "sevsixMain",
  "Phoenix Suns": "sunsMain",
  "Portland Trail Blazers": "blazersMain",
  "Sacramento Kings": "kingsMain",
  "San Antonio Spurs": "spursMain",
  "Toronto Raptors": "raptorsMain",
  "Utah Jazz": "jazzMain",
  "Washington Wizards": "wizardsMain",
};

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ha-fullscreen-menu">
      <div className="ha-menu-content">
        <button
          className="ha-menu-close"
          onClick={onClose}
          aria-label="Закрыть меню"
        >
          ✕
        </button>
        <h2 className="ha-menu-title">Команды НБА</h2>
        <ul className="ha-team-list">
          {NBA_TEAMS.map((team) => {
            const path = teamPathMap[team];
            return (
              <li key={team} className="ha-team-item">
                <Link to={`/${path}`} onClick={onClose}>
                  {team}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HamburgerMenu;
