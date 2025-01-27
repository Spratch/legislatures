"use client";

import { Cross1Icon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import IconButton from "./iconButton";
import useKeyPress from "../utils/hooks/useKeyPress";

function InfoLink({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="opacity-45 hover:opacity-70 transition-opacity"
    >
      {children}
    </Link>
  );
}

type Props = {
  setInfosVisibility: (value: boolean) => void;
};

export default function InfosModal({ setInfosVisibility }: Props) {
  // Close the modal
  const handleClose = useCallback(() => {
    setInfosVisibility(false);
  }, [setInfosVisibility]);

  // Close on escape key
  useKeyPress("Escape", handleClose);

  // Close on click outside
  const infoModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        infoModalRef.current &&
        !infoModalRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full p-4 sm:p-8 z-50 bg-black/25 backdrop-blur-sm">
      <div
        ref={infoModalRef}
        className="bg-white h-full w-full rounded-2xl shadow-lg max-w-screen-xl mx-auto relative overflow-x-scroll"
        role="popover"
      >
        <div className="sticky top-0 flex justify-end w-full p-4 gap-3 bg-gradient-to-b from-white z-50">
          <div className="bg-white rounded-full">
            <Link
              className="size-9 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
              href="https://github.com/Spratch/legislatures"
              target="_blank"
              title="Contribuer sur GitHub"
            >
              <GitHubLogoIcon className="size-5" />
            </Link>
          </div>

          <IconButton
            Icon={Cross1Icon}
            label="Fermer la modale"
            onClick={handleClose}
          />
        </div>

        <section className="grid grid-cols-12 gap-6 pb-14 border-b border-black px-5 sm:px-10">
          <h1 className="col-span-12 md:col-span-7 text-3xl md:text-5xl">
            <span className="opacity-40">Entre crises et revendications</span>
            <br />
            Les évolutions des courants politiques au sein de l&rsquo;Assemblée
            nationale*
          </h1>
          <div className="col-span-12 md:col-span-5 flex flex-col items-start text-xl md:text-2xl">
            <p className="opacity-75">
              Ce site est une représentation visuelle des résultats des
              élections législatives françaises depuis la première en 1791.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-x-6 px-5 sm:px-10">
          <article className="col-span-12 sm:col-span-7 py-8 border-b border-black max-w-prose flex flex-col gap-4">
            <p>
              Cette visualisation a été réalisée à partir de données de sources
              variées, mais principalement depuis la liste des législatures
              françaises sur{" "}
              <InfoLink
                href={
                  "https://fr.wikipedia.org/wiki/Liste_des_l%C3%A9gislatures_fran%C3%A7aises"
                }
              >
                Wikipédia
              </InfoLink>
              . Plus les données sont anciennes, moins elles sont précises. En
              effet, les concepts modernes de partis politiques ou de groupes
              parlementaires n&rsquo;existaient pas toujours. Les députés
              étaient alors étiquetés en fonction de leurs votes, une fois élus.
            </p>
            <p>
              De plus, il a fallu trancher de manière arbitraire sur
              l&rsquo;appartenance de chaque parti ou député à un courant
              politique. Les nuances et les évolutions des partis politiques ne
              sont d&rsquo;ailleurs pas forcément prises en compte. Ajoutons à
              cela que les familles politiques telles que la droite ou la gauche
              sont des notions qui, au fil du temps, ont pu se déplacer.
              L&rsquo;extrême gauche du début de la III<sup>e</sup> République
              pourrait correspondre aujourd&rsquo;hui à un positionnement
              centriste. Pour plus de clarté, j&rsquo;ai décidé de classer les
              partis à partir de repères contemporains.
            </p>
            <p>
              Enfin, j&rsquo;ai souhaité représenter les accords électoraux
              entre partis tels que les coalitions. Celles-ci permettent de
              mieux comprendre les rapports de force qui s&rsquo;opèrent. Elles
              n&rsquo;ont pas toujours les mêmes modalités, et les informations
              manquent parfois pour les élections les plus anciennes.
            </p>
          </article>
          <article className="col-span-12 sm:col-span-5 py-8 border-b border-black max-w-prose flex flex-col gap-4">
            <p>
              * Les assemblées ont pris différentes formes et différents noms,
              les modes de scrutin ont évolué et l&rsquo;Histoire a avancé en
              rendant chaque élection unique par les enjeux politiques et
              sociaux de l&rsquo;époque. Ce site propose une vision synthétique,
              et donc incomplète quant aux contextes entourant chaque élection.
            </p>
            <p>
              Cependant, des événements marquants sont placés en marge du
              graphique principal pour contextualiser d'avantage les résultats.
              Ces choix ne prétendent pas à l&rsquo;exhaustivité et peuvent
              gagner en pertinence. Vos retours sont les bienvenus.
            </p>
          </article>
          <article className="col-span-12 sm:col-span-7 py-8 sm:pb-0  max-w-prose flex flex-col gap-4 border-b border-black sm:border-none">
            <p>
              Ce graphique est inspiré du superbe travail de{" "}
              <InfoLink href="https://mastodon.social/@tomfevrier/112751171765233201">
                Tom Février et Marie Patino
              </InfoLink>{" "}
              pour{" "}
              <InfoLink href="https://www.bloomberg.com/graphics/2024-french-election-results/">
                cet article de Bloomberg
              </InfoLink>
              . En le découvrant, j&rsquo;aurais aimé pouvoir l&rsquo;étendre
              jusqu&rsquo;à la révolution de 1789. C&rsquo;est donc ce que
              j&rsquo;ai fait. Je l&rsquo;ai fait pour le plaisir, pour
              apprendre à créer des visualisations de données, et pour mieux
              comprendre l&rsquo;histoire politique de la France.
            </p>
            <p>
              J&rsquo;espère que vous prendrez autant de plaisir à le consulter,
              qu&rsquo;il vous apportera connaissances ou mises en perspectives.
              Si vous y rencontrez des erreurs, des imprécisions, des oublis, ou
              si vous avez des suggestions,{" "}
              <a
                href="mailto:legislaturesfr@gmail.com"
                className="text-blue-500 hover:opacity-70 transition-opacity"
              >
                n&rsquo;hésitez pas à me contacter
              </a>
              . Je ne suis ni historien, ni expert en politique, et c&rsquo;est
              mon premier projet de visualisation de données. Je suis donc
              ouvert à toute critique constructive, tant sur le contenu que sur
              le code.
            </p>
          </article>
          <article className="col-span-12 sm:col-span-5 pt-8 max-w-prose flex flex-col gap-4 justify-between">
            <p>
              Je remercie également toutes les personnes qui m&rsquo;ont apporté
              données, explications, retours et soutien.{" "}
            </p>
            <p className="border-t border-black/30 pt-6 mt-4">
              <InfoLink href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">
                Contenu soumis à la licence CC-BY-SA 4.0
              </InfoLink>
              . Source : Article{" "}
              <em>
                <InfoLink href="http://fr.wikipedia.org/wiki/Liste_des_l%C3%A9gislatures_fran%C3%A7aises">
                  Liste des législatures françaises
                </InfoLink>
              </em>{" "}
              de{" "}
              <InfoLink href="https://fr.wikipedia.org/">
                Wikipédia en français
              </InfoLink>{" "}
              (
              <InfoLink href="http://fr.wikipedia.org/w/index.php?title=Liste_des_l%C3%A9gislatures_fran%C3%A7aises&action=history">
                auteurs
              </InfoLink>
              )
            </p>
          </article>
        </section>
        <div className="sticky bottom-0 w-full h-16 bg-gradient-to-t from-white"></div>
      </div>
    </div>
  );
}
