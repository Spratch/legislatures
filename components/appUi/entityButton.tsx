import { CurrentType } from "@/types/current";
import { PartyType } from "@/types/party";
import truncateString from "@/utils/truncateString";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { getLangKey } from "../utils/getLangKey";

type EntityType = CurrentType | PartyType | { name: React.ReactNode };

type Props = {
  entity: EntityType;
  onClick: (entity: any) => void;
  isActive: boolean;
  label?: string;
};

export default function EntityButton({
  entity,
  onClick,
  isActive,
  label
}: Props) {
  const isParty = (entity: EntityType): entity is PartyType =>
    "full_name" in entity;
  const isCurrent = (entity: EntityType): entity is CurrentType =>
    "color" in entity;

  // I18n
  const lang = useDictionary().locale.lang;
  let entityName = entity.name;
  let entityFullName = "";
  if (isCurrent(entity)) {
    entityName = entity[getLangKey("name", lang)];
  } else if (isParty(entity)) {
    entityFullName = entity[getLangKey("full_name", lang)];
  }

  return (
    <button
      aria-label={label}
      tabIndex={!label ? -1 : 0}
      className={`group flex min-h-full max-w-full items-center gap-2 text-nowrap bg-black/5 py-1 text-sm text-black/55 transition sm:py-0.5 sm:text-base sm:hover:bg-black/10 sm:hover:text-black ${isActive ? "" : "opacity-50"} ${isParty(entity) ? "rounded-md px-1.5" : "rounded-full px-3"} `}
      onClick={() => onClick(entity)}
    >
      {/* Currents have color point */}
      {isCurrent(entity) && (
        <span className="relative flex size-3">
          <span
            className="absolute inline-flex size-full rounded-full opacity-75 group-hover:animate-ping"
            style={{ backgroundColor: entity.color }}
          ></span>
          <span
            className="relative inline-flex size-3 rounded-full"
            style={{ backgroundColor: entity.color }}
          ></span>
        </span>
      )}

      <span className="flex min-w-0 items-center">
        {isParty(entity) && (
          <span
            aria-hidden
            className="all-small-caps mr-1 inline-flex h-full text-nowrap text-xs text-black/40 transition group-hover:text-black/50 sm:text-black/35"
          >
            {entityName}
          </span>
        )}

        {/* If party, display full name */}
        <span className="text-nowrap">
          {isParty(entity)
            ? truncateString(entityFullName || entity.full_name, 30)
            : entityName}
        </span>
      </span>
    </button>
  );
}
