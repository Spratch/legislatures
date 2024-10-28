"use client";

import { useEffect, useState } from "react";
import FiltersLine from "../components/appUi/filtersLine";
import Main from "../components/appUi/main";
import { useVisibleCurrentsContext } from "../components/utils/currentsContext";
import { FamilyType } from "../types/family";
import { RepublicType } from "../types/republic";
import { CurrentType } from "../types/current";
import { EventType } from "../types/event";
import SettingsLine from "../components/appUi/settingsLine";

export default function HomePage() {
    const [republics, setRepublics] = useState<RepublicType[] | null>(null);
    const [currents, setCurrents] = useState<CurrentType[] | null>(null);
    const [families, setFamilies] = useState<FamilyType[] | null>(null);
    const [events, setEvents] = useState<EventType[] | null>(null);
    const { visibleCurrents, setVisibleCurrents } = useVisibleCurrentsContext();
    const [axisLeftPercentage, setAxisLeftPercentage] = useState(10);

    // Fetch the data
    useEffect(() => {
        // Fetch the republics
        fetch('/data/republics.json')
            .then((response) => response.json())
            .then((data) => setRepublics(data.republics));

        // Fetch the currents
        fetch('/data/currents.json')
            .then((response) => response.json())
            .then((data) => {
                setFamilies(data.families);
                setCurrents(data.families.flatMap((family: FamilyType) => family.currents));
                setVisibleCurrents(data.families.flatMap((family: FamilyType) => family.currents));
            });
        
        // Fetch the events
        fetch('/data/events.json')
            .then((response) => response.json())
            .then((data) => setEvents(data.events));
    }, [setVisibleCurrents]);

    return (
        <>
                {/* <header className="grid grid-cols-12 gap-6 px-5 md:px-10 mt-4 md:mt-8 mb-3 md:mb-6 max-w-screen-3xl mx-auto">
                    <h1 className="col-start-1 col-span-12 md:col-span-7 text-3xl md:text-5xl">
                        <span className="opacity-40">
                            Entre crises et revendications
                        </span>
                        <br/>
                        Les évolutions de la représentation des courants politiques au sein de l’Assemblée Nationale
                    </h1>
                    <div className="col-span-12 md:col-start-8 md:col-span-5 flex flex-col items-start text-xl md:text-2xl">
                        <p className="opacity-75">
                            Ce site est une représentation visuelle des résultats des élections législatives françaises depuis leur création. Pariatur minim irure ex magna voluptate eiusmod minim dolore duis laboris ad.
                        </p>
                        <button className="opacity-30 hover:opacity-50">
                            En savoir plus
                        </button>
                    </div>
                </header> */}

                {/* <div className="fixed z-20 p-2">
                    <SettingsButton
                        Icon={MixerVerticalIcon}
                        onClick={() => setSettingsVisibility(!settingsVisibility)}
                        label="Paramétrer la visualisation"
                    />
                </div> */}

                <SettingsLine
                    eventVisibility={axisLeftPercentage === 10 ? false : true}
                    setEventVisibility={() => setAxisLeftPercentage(axisLeftPercentage === 10 ? 50 : 10)}
                />

                <Main 
                    republics={republics} 
                    currents={currents} 
                    events={events}
                    axisLeftPercentage={axisLeftPercentage}
                />
                <FiltersLine
                    families={families}
                    // setSettingsVisibility={() => setSettingsVisibility(!settingsVisibility)}
                />                
        </>
    )
} 