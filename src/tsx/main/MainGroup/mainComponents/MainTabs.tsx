// import React, { useEffect, useRef, useState } from "react";
// import { TabType } from "../MainTypes";

// interface TabsProps {
//   activeTab: TabType;
//   onTabChange: (tab: TabType) => void;
// }

// const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const tabs: Array<{ id: TabType; label: string }> = [
//     { id: "teams", label: "Команды" },
//     { id: "console", label: "Консоль комиссионера" },
//     { id: "reserve", label: "События" },
//     { id: "market", label: "Рынок" },
//   ];

//   const activeIndex = tabs.findIndex((t) => t.id === activeTab);
//   const activeTabData = tabs[activeIndex] ?? tabs[0];

//   // Закрытие по клику вне компонента
//   useEffect(() => {
//     if (!isOpen) return;
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setIsOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEsc);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, [isOpen]);

//   const handleSelect = (id: TabType) => {
//     onTabChange(id);
//     setIsOpen(false);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
//     e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
//   };

//   return (
//     <div className="tabs-container" ref={containerRef}>
//       <div className="tabs-wrapper">
//         <div className={`tab-select ${isOpen ? "open" : ""}`}>
//           {/* Кнопка-триггер */}
//           <button
//             type="button"
//             className="tab-trigger"
//             onClick={() => setIsOpen((v) => !v)}
//             onMouseMove={handleMouseMove}
//             aria-haspopup="listbox"
//             aria-expanded={isOpen}
//           >
//             <span className="tab-number">
//               {String(activeIndex + 1).padStart(2, "0")}
//             </span>
//             <span className="tab-label">{activeTabData.label}</span>
//             <span className={`tab-chevron ${isOpen ? "rotated" : ""}`}>
//               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                 <path
//                   d="M2.5 4.5L6 8L9.5 4.5"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </span>
//             <span className="tab-underline" />
//           </button>

//           {/* Выпадающая табличка */}
//           {isOpen && (
//             <div className="tab-dropdown" role="listbox">
//               {tabs.map((tab, index) => (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   role="option"
//                   aria-selected={tab.id === activeTab}
//                   className={`tab-option ${
//                     tab.id === activeTab ? "active" : ""
//                   }`}
//                   onClick={() => handleSelect(tab.id)}
//                   onMouseMove={handleMouseMove}
//                 >
//                   <span className="tab-number">
//                     {String(index + 1).padStart(2, "0")}
//                   </span>
//                   <span className="tab-label">{tab.label}</span>
//                   {tab.id === activeTab && (
//                     <span className="tab-check">
//                       <svg
//                         width="14"
//                         height="14"
//                         viewBox="0 0 14 14"
//                         fill="none"
//                       >
//                         <path
//                           d="M2.5 7L5.5 10L11.5 4"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Tabs;

import React, { useEffect, useRef, useState } from "react";
import { TabType } from "../MainTypes";

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "teams", label: "Команды" },
    { id: "console", label: "Консоль комиссионера" },
    { id: "reserve", label: "События" },
    { id: "market", label: "Рынок" },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const activeTabData = tabs[activeIndex] ?? tabs[0];

  // Закрытие по клику вне компонента
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleSelect = (id: TabType) => {
    onTabChange(id);
    setIsOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div className="tabs-container" ref={containerRef}>
      <div className="tabs-wrapper">
        <div className={`tab-select ${isOpen ? "open" : ""}`}>
          {/* Кнопка-триггер */}
          <button
            type="button"
            className="tab-trigger"
            onClick={() => setIsOpen((v) => !v)}
            onMouseMove={handleMouseMove}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="tab-label">{activeTabData.label}</span>
            <span className={`tab-chevron ${isOpen ? "rotated" : ""}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="tab-underline" />
          </button>

          {/* Выпадающая табличка */}
          {isOpen && (
            <div className="tab-dropdown" role="listbox">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="option"
                  aria-selected={tab.id === activeTab}
                  className={`tab-option ${
                    tab.id === activeTab ? "active" : ""
                  }`}
                  onClick={() => handleSelect(tab.id)}
                  onMouseMove={handleMouseMove}
                >
                  <span className="tab-label">{tab.label}</span>
                  {tab.id === activeTab && (
                    <span className="tab-check">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
