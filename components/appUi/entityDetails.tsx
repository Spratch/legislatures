"use client";

import Image from "next/image";
import EntityButton from "./entityButton";
import Badge from "./badge";
import WikiLink from "./wikiLink";
import { Cross1Icon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import { useDetailsContext } from "@/utils/contexts/detailsContext";
import { CurrentType } from "@/types/current";
import { EventType } from "@/types/event";
import { PartyType } from "@/types/party";
import { useVisibleCurrentsContext } from "@/utils/contexts/currentsContext";
import truncateString from "@/utils/truncateString";
import IconButton from "./iconButton";
import useKeyPress from "@/utils/hooks/useKeyPress";
import { useHorizontalScroll } from "@/utils/hooks/useHorizontalScroll";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { getLangKey } from "../utils/getLangKey";

export default function EntityDetails() {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.entityDetails;

  // Get the entity to display from the context
  const { detailsContent, setDetailsContent } = useDetailsContext();
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
  const subEntities = current?.parties || party?.persons || null;

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
    <div className="fixed z-40 bg-black/25 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-0 top-0 bottom-0 left-0 right-0 sm:pointer-events-none p-2 sm:px-5 sm:py-16 flex items-end justify-center sm:justify-start">
      <div
        ref={detailsRef}
        className="rounded-2xl shadow-lg w-full sm:w-auto max-w-[28rem] max-h-full overflow-y-scroll bg-white p-2.5 sm:p-3 flex flex-col gap-2.5 border border-black/5 pointer-events-auto"
        role="dialog"
        tabIndex={0}
      >
        {/* Buttons bar */}
        <div className="flex justify-between w-full gap-2">
          {/* If current, add a button to display or hide it */}
          {
            current ? (
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
                  <div className="flex gap-2 items-stretch">
                    <div className="h-9 px-2.5 rounded-full border border-black/20 border-dashed text-sm text-black/50 leading-none flex items-center">
                      {endDate !== beginDate
                        ? `${beginDate} → ${endDate}`
                        : beginDate}
                    </div>
                    {event.type && (
                      <Badge
                        name={event.type}
                        hex={
                          {
                            Cohabitation: "#FFC107",
                            Référendum: "#4CAF50",
                            Lutte: "#673AB7",
                            Guerre: "#D32F2F",
                            Loi: "#2196F3"
                          }[event.type] || "black"
                        }
                        label={event.type}
                        isClickable={false}
                      />
                    )}
                  </div>
                );
              })()
            ) : (
              <div></div>
            )
            // // If person, display the parent button
            // : <EntityButton
            //     entity={parent}
            //     onClick={() => {}}
            //     isActive={true}
            // />
          }
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
            className="w-full relative object-cover object-[50%_25%] max-h-60 rounded-lg pointer-events-none"
          />
        )}
        {/* Title and infos */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-lg sm:text-xl !leading-tight font-bold flex gap-2 items-center">
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
                    className={`relative inline-flex size-2.5 sm:size-3 rounded-full transition-opacity ${
                      isVisible ? "" : "opacity-50"
                    }`}
                    style={{ backgroundColor: current.color }}
                  ></span>
                </span>
              )}

              {title}
            </h2>

            <p className="text-gray-500 text-base leading-snug">
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
            <h3 className="font-bold">
              {current ? dict.parties : dict.persons}
            </h3>
            <ul
              ref={detailsScrollRef}
              className="w-full flex overflow-x-scroll gap-1.5 justify-start no-scrollbar"
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
