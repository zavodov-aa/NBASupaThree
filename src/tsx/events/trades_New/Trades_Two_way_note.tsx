// import React from "react";

// interface Trades_Two_way_noteProps {
//   myTeamName: string;
//   theirTeamName: string;
//   generalNote: string;
//   myTeamNote: string;
//   theirTeamNote: string;
//   onGeneralNoteChange: (text: string) => void;
//   onMyTeamNoteChange: (text: string) => void;
//   onTheirTeamNoteChange: (text: string) => void;
//   onBack: () => void;
//   onSubmit: () => void;
// }

// const Trades_Two_way_note: React.FC<Trades_Two_way_noteProps> = ({
//   myTeamName,
//   theirTeamName,
//   generalNote,
//   myTeamNote,
//   theirTeamNote,
//   onGeneralNoteChange,
//   onMyTeamNoteChange,
//   onTheirTeamNoteChange,
//   onBack,
//   onSubmit,
// }) => {
//   return (
//     <div className="Trades-Two-way-note">
//       <h4>Примечания к трейду</h4>

//       <div className="Trades-Two-way-note-section">
//         <label>Общее примечание (для всей сделки)</label>
//         <textarea
//           className="Trades-Two-way-note-input"
//           value={generalNote}
//           onChange={(e) => onGeneralNoteChange(e.target.value)}
//           placeholder="Например: обмен состоится после драфта..."
//           rows={3}
//         />
//       </div>

//       <div className="Trades-Two-way-note-section">
//         <label>Примечание для {myTeamName}</label>
//         <textarea
//           className="Trades-Two-way-note-input"
//           value={myTeamNote}
//           onChange={(e) => onMyTeamNoteChange(e.target.value)}
//           placeholder="Внутренний комментарий вашей команды..."
//           rows={2}
//         />
//       </div>

//       <div className="Trades-Two-way-note-section">
//         <label>Примечание для {theirTeamName}</label>
//         <textarea
//           className="Trades-Two-way-note-input"
//           value={theirTeamNote}
//           onChange={(e) => onTheirTeamNoteChange(e.target.value)}
//           placeholder="Комментарий для команды-соперника..."
//           rows={2}
//         />
//       </div>

//       <div className="Trades-Two-way-actions">
//         <button className="Trades-Two-way-back" onClick={onBack}>
//           Назад
//         </button>
//         <button className="Trades-Two-way-submit" onClick={onSubmit}>
//           Подтвердить трейд
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_note;

import React from "react";
import "./trades_Two_way_note.css";

interface Trades_Two_way_noteProps {
  myTeamName: string;
  theirTeamName: string;
  generalNote: string;
  myTeamNote: string;
  theirTeamNote: string;
  onGeneralNoteChange: (text: string) => void;
  onMyTeamNoteChange: (text: string) => void;
  onTheirTeamNoteChange: (text: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const Trades_Two_way_note: React.FC<Trades_Two_way_noteProps> = ({
  myTeamName,
  theirTeamName,
  generalNote,
  myTeamNote,
  theirTeamNote,
  onGeneralNoteChange,
  onMyTeamNoteChange,
  onTheirTeamNoteChange,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="Trades_Two_way_note-container">
      <h4 className="Trades_Two_way_note-title">Примечания к трейду</h4>

      <div className="Trades_Two_way_note-section">
        <label className="Trades_Two_way_note-label">
          Общее примечание (для всей сделки)
        </label>
        <textarea
          className="Trades_Two_way_note-textarea"
          value={generalNote}
          onChange={(e) => onGeneralNoteChange(e.target.value)}
          placeholder="Например: обмен состоится после драфта..."
          rows={3}
        />
      </div>

      <div className="Trades_Two_way_note-section">
        <label className="Trades_Two_way_note-label">
          Примечание для {myTeamName}
        </label>
        <textarea
          className="Trades_Two_way_note-textarea"
          value={myTeamNote}
          onChange={(e) => onMyTeamNoteChange(e.target.value)}
          placeholder="Внутренний комментарий вашей команды..."
          rows={2}
        />
      </div>

      <div className="Trades_Two_way_note-section">
        <label className="Trades_Two_way_note-label">
          Примечание для {theirTeamName}
        </label>
        <textarea
          className="Trades_Two_way_note-textarea"
          value={theirTeamNote}
          onChange={(e) => onTheirTeamNoteChange(e.target.value)}
          placeholder="Комментарий для команды-соперника..."
          rows={2}
        />
      </div>

      <div className="Trades_Two_way_note-actions">
        <button
          className="Trades_Two_way_note-button Trades_Two_way_note-button-back"
          onClick={onBack}
        >
          Назад
        </button>
        <button
          className="Trades_Two_way_note-button Trades_Two_way_note-button-submit"
          onClick={onSubmit}
        >
          Подтвердить трейд
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_note;
