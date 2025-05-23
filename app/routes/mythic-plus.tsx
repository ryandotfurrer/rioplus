import { Link, redirect } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Route } from "./+types/home";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import AffixCards from "~/components/affix-cards";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mythic+" },
    {
      name: "description",
      content:
        "A place for me to practice fetching data using the Raider.io API",
    },
  ];
}

interface Affix {
  id: number;
  name: string;
  description: string;
  wowhead_url: string;
  icon_url: string;
}
interface CharacterData {
  last_crawled_at: string;
  mythic_plus_scores_by_season: any;
  mythic_plus_ranks: any;
  mythic_plus_best_runs: any;
  class: string;
  active_spec_name: string;
  name: string;
  race: string;
  guild: {
    name: string;
  };
}

export default function MythicPlus() {
  const [isMobile, setIsMobile] = useState(true);
  const [affixes, setAffixes] = useState<Affix[]>([]);
  const [affixesLoading, setAffixesLoading] = useState(true);
  const [affixesError, setAffixesError] = useState<Error | null>(null);
  const [region, setRegion] = useState<string>("US");
  const [realm, setRealm] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [characterLoading, setCharacterLoading] = useState(false);
  const [characterError, setCharacterError] = useState<Error | null>(null);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      async function fetchAffixes() {
        try {
          const response = await fetch(
            `https://raider.io/api/v1/mythic-plus/affixes?access_key=RIO1irVueuVxGKwtqzZ91Ngzi&region=us&locale=en`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setAffixes(data.affix_details);
        } catch (error) {
          setAffixesError(error as Error);
        } finally {
          setAffixesLoading(false);
        }
      }

      fetchAffixes();
    }
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1>Mythic+</h1>
        <p>See this week's affixes and learn more about them!</p>
      </header>

      <section className="space-y-4 mb-8">
        <h2>This Week's Affixes</h2>
        <p className="text-lg text-foreground">
          {affixes.map((affix) => affix.name).join(", ")}
        </p>
        <AffixCards />
      </section>
    </>
  );
}
