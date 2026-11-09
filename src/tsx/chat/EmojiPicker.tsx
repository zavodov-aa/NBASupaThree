type Props = {
  emojis: string[];
  onPick: (emoji: string) => void;
  onClose: () => void;
};

export default function EmojiPicker({ emojis, onPick, onClose }: Props) {
  return (
    <div className="emoji-picker-backdrop" onClick={onClose}>
      <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
        <div className="emoji-picker__grid">
          {emojis.map((e) => (
            <button
              key={e}
              type="button"
              className="emoji-picker__item"
              onClick={() => {
                onPick(e);
                onClose();
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
