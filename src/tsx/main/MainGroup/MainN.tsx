// Main.tsx
import React, { useState } from "react";

import "./css/mainNStyles.css";
import { TabType } from "./MainTypes";
import { teams } from "./mainData/MainDataTeams";
import { consoleCom } from "./mainData/MainDataConsole";
import { eventsLeague } from "./mainData/MainDataEvents";
import { marketData } from "./mainData/MainDataMarket";
import { useFeedback } from "./mainHooks/useFeedback";
import Header from "./mainComponents/MainHeader";
import Tabs from "./mainComponents/MainTabs";
import TabContent from "./mainComponents/MainTabContent";
import FeedbackMenu from "./mainComponents/MainFeedbackMenu";

const MainN: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("teams");
  const feedback = useFeedback();

  return (
    <div className="main">
      <FeedbackMenu
        show={feedback.showFeedbackMenu}
        feedbackData={feedback.feedbackData}
        isSubmitting={feedback.isSubmitting}
        submitMessage={feedback.submitMessage}
        onClose={feedback.handleCloseMenu}
        onChange={feedback.handleInputChange}
        onSubmit={feedback.handleSubmitFeedback}
      />

      <Header
        onFeedbackClick={feedback.handleOpenMenu}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* <Tabs activeTab={activeTab} onTabChange={setActiveTab} /> */}

      <div className="body">
        <TabContent
          activeTab={activeTab}
          teams={teams}
          consoleCom={consoleCom}
          eventsLeague={eventsLeague}
          marketData={marketData}
        />
      </div>
    </div>
  );
};

export default MainN;
