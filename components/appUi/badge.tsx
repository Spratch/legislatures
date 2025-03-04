import hexToRgb from "@/utils/hexToRgb";

type Props = {
  name: string;
  hex: string;
  label?: string;
  onClick?: () => void;
  isClickable?: boolean;
};

export default function Badge({
  name,
  hex,
  label,
  onClick,
  isClickable = true
}: Props) {
  const color = hexToRgb(hex);

  return (
    <button
      aria-label={label}
      aria-hidden={!label}
      className={`bg-opacity-10 text-opacity-90 rounded-lg px-2 py-1 sm:py-0.5 text-sm sm:text-base font-normal cursor-pointer hover:bg-opacity-20 hover:text-opacity-100 hover:shadow-sm transition text-nowrap items-center flex gap-1.5 truncate ${
        isClickable ? "" : "pointer-events-none"
      }`}
      style={{
        backgroundColor: `rgb(
                    ${color}, 
                    var(--tw-bg-opacity)
                )`,
        color: `rgb(
                    ${color}, 
                    var(--tw-text-opacity)
                )`,
        borderColor: `rgb(
                    ${color}, 
                    var(--tw-border-opacity)
                )`
      }}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
