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
      tabIndex={!label ? -1 : 0}
      className={`flex cursor-pointer items-center gap-1.5 truncate text-nowrap rounded-lg bg-opacity-10 px-2 py-1 text-sm font-normal text-opacity-90 transition hover:bg-opacity-20 hover:text-opacity-100 hover:shadow-sm sm:py-0.5 sm:text-base ${
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
