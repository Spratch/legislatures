import { CurrentType } from "@/types/current";
import { EventType } from "@/types/event";
import { PartyType } from "@/types/party";
import { useVisibleCurrentsContext } from "@/utils/contexts/currentsContext";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { useHorizontalScroll } from "@/utils/hooks/useHorizontalScroll";
import useKeyPress from "@/utils/hooks/useKeyPress";
import truncateString from "@/utils/truncateString";
import { Cross1Icon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import Image from "next/image";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import { detailsContentAtom } from "../utils/contexts/atoms";
import { getLangKey } from "../utils/getLangKey";
import Badge from "./badge";
import EntityButton from "./entityButton";
import IconButton from "./iconButton";
import WikiLink from "./wikiLink";

export default function EntityDetails() {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.entityDetails;

  // Get the entity to display from the context
  const [detailsContent, setDetailsContent] = useAtom(detailsContentAtom);
  const { entity, parent } = detailsContent;

  // Set the details content
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [wikiLink, setWikiLink] = useState(null);

  // Determine the entity type and create typed entity
  const entityType =
    "parties" in entity ? "current" : "title" in entity ? "event" : "party";
  const current = entityType === "current" ? (entity as CurrentType) : null;
  const party = entityType === "party" ? (entity as PartyType) : null;
  const event = entityType === "event" ? (entity as EventType) : null;

  // Get the entity title
  const title = event
    ? event[getLangKey("title", lang)]
    : party
      ? party[getLangKey("full_name", lang)]
      : current?.[getLangKey("name", lang)];

  const updateWikiLink = (wikiUrl: string, keyword: string) => {
    let fullWikiLink = wikiUrl;

    if (keyword.search("#") !== -1) {
      fullWikiLink =
        wikiUrl +
        "#" +
        encodeURIComponent(keyword.split("#")[1].replace(/ /g, "_"));
    }

    // Update the link
    setWikiLink(fullWikiLink);
  };

  // Fetch the entity content on mount
  const pageTitle = event
    ? event.title
    : party
      ? party.full_name
      : current.name;
  useEffect(() => {
    if (entity) {
      const fetchWiki = (searchTerm: string) => {
        const noInfo = dict.noAvailableData;
        fetch("/api/wiki", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ keyword: searchTerm, lang })
        })
          .then((response) => response.json())
          .then((data) => {
            setDescription(
              data.firstParagraphLang || data.firstParagraphFr || noInfo
            );
            setImage(data.thumbnail);
            updateWikiLink(data.pageUrlLang || data.pageUrlFr, searchTerm);
          });
      };
      fetchWiki(entity.keyword || pageTitle);
    }
  }, [entity, pageTitle, dict, lang]);

  // Get the sub entities
  const subEntities = current?.parties || null;

  // Determine if the displayed current is visible or not
  const { visibleCurrents, setVisibleCurrents } = useVisibleCurrentsContext();
  let isVisible = false;
  if (current) {
    isVisible = visibleCurrents.some((c) => c.name === current.name);
  }
  // Hide or show the current
  function handleVisibility() {
    isVisible
      ? setVisibleCurrents(
          visibleCurrents.filter((c) => c.name !== current.name)
        )
      : setVisibleCurrents([...visibleCurrents, current]);
  }

  // Define the colors for each event type
  const eventTypeColors = {
    Cohabitation: "#FFC107",
    Référendum: "#4CAF50",
    Lutte: "#673AB7",
    Guerre: "#D32F2F",
    Loi: "#2196F3"
  };
  // Get the event type properties
  const eventTypeColor = event?.type
    ? eventTypeColors[event.type] || "black"
    : "black";
  const eventTypeTitle = event?.type
    ? dict[`type_${event.type.toLowerCase()}`] || event.type
    : "";

  // Close the details
  const handleClose = useCallback(() => {
    setDetailsContent(null);
  }, [setDetailsContent]);
  // Close on escape key
  useKeyPress("Escape", handleClose);
  // Close on click outside (when detailsContent is not null)
  const detailsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    if (detailsContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [detailsContent, handleClose]);

  // Open the details of the sub entity
  function onClick(subEntity: any, entity?: any) {
    setDetailsContent({
      entity: subEntity,
      parent: entity
    });
  }

  // Convert vertical scroll to horizontal scroll
  const detailsScrollRef = useHorizontalScroll<HTMLUListElement>();

  // Get window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-40 flex items-end justify-center bg-black/25 p-2 backdrop-blur-sm sm:pointer-events-none sm:justify-start sm:bg-transparent sm:px-5 sm:py-16 sm:backdrop-blur-0">
      <div
        ref={detailsRef}
        className="pointer-events-auto flex max-h-full w-full max-w-[28rem] flex-col gap-2.5 overflow-y-scroll rounded-2xl border border-black/5 bg-white p-2.5 shadow-lg sm:w-auto sm:p-3"
        role="dialog"
        tabIndex={0}
      >
        {/* Buttons bar */}
        <div className="flex w-full justify-between gap-2">
          {/* If current, add a button to display or hide it */}
          {current ? (
            <IconButton
              Icon={isVisible ? EyeOpenIcon : EyeClosedIcon}
              label={isVisible ? dict.hideCurrent : dict.showCurrent}
              onClick={() => handleVisibility()}
            />
          ) : // If party, display the parent badge
          party ? (
            <Badge
              name={(parent as CurrentType)[getLangKey("name", lang)]}
              hex={(parent as CurrentType).color}
              label={`${dict.current}: ${
                (parent as CurrentType)[getLangKey("name", lang)]
              }`}
              onClick={() => onClick(parent)}
            />
          ) : // If event, display dates and type
          event ? (
            (() => {
              const beginDate = new Date(event.begin).getFullYear();
              const endDate = new Date(event.end).getFullYear();
              return (
                <div className="flex items-stretch gap-2">
                  <div className="flex h-9 items-center rounded-full border border-dashed border-black/20 px-2.5 text-sm leading-none text-black/50">
                    {endDate !== beginDate
                      ? `${beginDate} → ${endDate}`
                      : beginDate}
                  </div>
                  {event.type && (
                    <Badge
                      name={eventTypeTitle}
                      hex={eventTypeColor}
                      label={eventTypeTitle}
                      isClickable={false}
                    />
                  )}
                </div>
              );
            })()
          ) : (
            <div></div>
          )}
          <IconButton
            Icon={Cross1Icon}
            label={dict.close}
            onClick={handleClose}
          />
        </div>
        {/* Display image if present */}
        {image && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="pointer-events-none relative max-h-60 w-full rounded-lg object-cover object-[50%_25%]"
          />
        )}
        {/* Title and infos */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col items-start gap-1">
            <h2 className="flex items-center gap-2 text-lg font-bold !leading-tight sm:text-xl">
              {/* Display color if current */}
              {current && current.color && (
                <span className="relative flex size-2.5 sm:size-3">
                  <span
                    className={`absolute inline-flex size-full rounded-full transition-opacity ${
                      isVisible ? "animate-ping opacity-75" : "opacity-0"
                    }`}
                    style={{ backgroundColor: current.color }}
                  ></span>
                  <span
                    className={`relative inline-flex size-2.5 rounded-full transition-opacity sm:size-3 ${
                      isVisible ? "" : "opacity-50"
                    }`}
                    style={{ backgroundColor: current.color }}
                  ></span>
                </span>
              )}

              {title}
            </h2>

            <p className="text-base leading-snug text-gray-500">
              {/* If small screens, truncate at 250, else 400 */}
              {description
                ? truncateString(description, windowWidth < 640 ? 250 : 400)
                : dict.loading}
            </p>
            {wikiLink && <WikiLink href={wikiLink} />}
          </div>

          {/* Sub entities */}
          <div
            className={`flex flex-col gap-2 ${
              subEntities ? "block" : "hidden"
            }`}
          >
            <h3 className="font-bold">{dict.parties}</h3>
            <ul
              ref={detailsScrollRef}
              className="no-scrollbar flex w-full justify-start gap-1.5 overflow-x-scroll"
            >
              {subEntities &&
                subEntities.map((subEntity: PartyType | any, index: Key) => (
                  <EntityButton
                    key={index}
                    entity={subEntity}
                    onClick={() => onClick(subEntity, entity)}
                    isActive={true}
                    label={`${subEntity.full_name || subEntity.name}, ${
                      dict.details
                    }`}
                  />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
