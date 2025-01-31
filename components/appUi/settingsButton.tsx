import useKeyPress from "../utils/hooks/useKeyPress";

type SettingsButtonProps = {
  Icon?: React.ElementType;
  flipIcon?: boolean;
  number?: number;
  color?: string;
  name?: string;
  onClick: () => void;
  isActive?: boolean;
  label: string;
  isVisible?: boolean;
  position?: { x: "left" | "right"; y: "top" | "bottom" };
  kbd?: string | string[];
  straightSide?: "left" | "right" | null;
};

export default function SettingsButton({
  Icon,
  flipIcon,
  number,
  color,
  name,
  onClick,
  isActive = true,
  label,
  isVisible = true,
  position,
  kbd,
  straightSide
}: SettingsButtonProps) {
  useKeyPress(kbd, onClick);
  return (
    <div
      className={`relative group ${
        !isVisible
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      <button
        aria-label={label}
        aria-hidden={!isVisible}
        className={` flex items-center justify-center rounded-full border border-black/10 hover:border-black/20 transition text-nowrap gap-2 select-none bg-white
                    ${Icon && !name ? "size-9 flex-shrink-0" : "h-9 px-3"}
                    ${(number || number === 0) && name ? "pl-1.5 pr-3" : ""}
                    ${!isVisible ? "translate-y-10" : "translate-y-0"}
                    ${
                      straightSide === "left"
                        ? "rounded-l-none pr-0.5"
                        : straightSide === "right"
                        ? "rounded-r-none pr-2"
                        : ""
                    }
                `}
        onClick={onClick}
        aria-keyshortcuts={Array.isArray(kbd) ? kbd.join(" ou ") : kbd || ""}
      >
        {(number || number === 0) && (
          <span
            className={`flex items-center justify-center group-hover:bg-[var(--family-color)] transition rounded-full text-xs group-hover:text-white size-6
                            ${
                              isActive
                                ? "bg-[var(--family-color)] text-white group-hover:bg-black/75"
                                : "bg-black/5 text-black/65"
                            }
                        `}
            style={{ "--family-color": color } as React.CSSProperties}
          >
            {number}
          </span>
        )}
        {Icon && (
          <Icon
            className={`size-4 ${
              flipIcon ? "-scale-x-100" : ""
            } transition-transform`}
          />
        )}
        {name && (
          <span className="inline text-black/60 group-hover:text-black transition text-nowrap">
            {name}
          </span>
        )}
      </button>

      {/* Tooltip */}
      {position && (
        <div
          aria-hidden
          className="hidden group-hover:block group-has-[:focus]:block sm:group-has-[:focus:not(:hover):not(:focus-visible)]:hidden delay-100 absolute text-xs text-left text-nowrap z-40 bg-white p-1.5 rounded-md border border-black/20 pointer-events-none opacity-85"
          style={{
            left: position?.x === "left" ? 0 : "auto",
            right: position?.x === "right" ? 0 : "auto",
            top: position?.y === "top" ? "2.5rem" : "auto",
            bottom: position?.y === "bottom" ? "2.5rem" : "auto"
          }}
        >
          {label}
          {kbd && (
            <kbd className="hidden sm:inline ml-1.5 text-black/80 border border-black/30 rounded px-1 py-0.5 bg-black/5">
              {kbd[0] || kbd}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}
