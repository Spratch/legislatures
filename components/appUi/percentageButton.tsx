import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { StarIcon } from "@radix-ui/react-icons";

type PercentageButtonProps = {
  percentage: number;
  deputies: number;
  totalDeputies: number;
  isPercentage: boolean;
  onHover: () => void;
  isMostImportant?: boolean;
};

export default function PercentageButton({
  percentage,
  deputies,
  totalDeputies,
  isPercentage,
  onHover,
  isMostImportant = false
}: PercentageButtonProps) {
  const dict = useDictionary().percentage;

  // If the percentage is 100, display "Plein pouvoirs"
  const isFullPowers = percentage === 100;
  return (
    <div
      className={`flex cursor-default items-center rounded-full px-1.5 py-1 text-xs sm:py-0.5 ${isMostImportant ? "bg-blue-100 text-blue-500" : "bg-black/5 text-black/65"}`}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      aria-hidden
    >
      {!isFullPowers && isMostImportant && <StarIcon className="mr-1 size-3" />}
      <span className="text-nowrap">
        {isFullPowers
          ? dict.fullPowers
          : isPercentage
            ? percentage.toFixed(1)
            : deputies}
      </span>
      {!isFullPowers && (
        <span className="opacity-50">
          {isPercentage ? "\u202F%" : "/" + totalDeputies}
        </span>
      )}
    </div>
  );
}
