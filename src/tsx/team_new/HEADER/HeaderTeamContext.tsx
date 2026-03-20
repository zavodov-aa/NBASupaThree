// TeamContext.tsx
import React, { createContext, useContext } from "react";
import { teamColors } from "./HeaderColorsTeams";

type TeamId = keyof typeof teamColors;

interface TeamContextType {
  colors: { bg: string; text: string; logo: "white" | "black" | "original" };
}

const TeamContext = createContext<TeamContextType | null>(null);

export const TeamProvider = ({
  teamId,
  children,
}: {
  teamId: TeamId;
  children: React.ReactNode;
}) => {
  const colors = teamColors[teamId];
  return (
    <TeamContext.Provider
      value={{
        // teamId,
        colors,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within TeamProvider");
  return context;
};
