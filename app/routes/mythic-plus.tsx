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
import CharacterSearch from "~/components/character-search";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const region = formData.get("region") as string;
  const realm = formData.get("realm") as string;
  const character = formData.get("character") as string;
  
  if (!region || !realm || !character) {
    return { error: "Please provide all required fields." };
  }
  
  // Redirect to character page
  return redirect(`/character/${region}/${encodeURIComponent(realm)}/${encodeURIComponent(character)}`);
}

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

      <section className="space-y-4 mb-8">
        <h2>Character Lookup</h2>
        <CharacterSearch />
        {characterLoading ? (
          <p>Loading Character...</p>
        ) : characterError ? (
          <p>
            <span className="text-rose-600 dark:text-rose-400">
              Character not found
            </span>{" "}
            - check the information you provided and try again.
          </p>
        ) : characterData ? (
          <div className="gap-4 grid grid-cols-1">
            <div>
              <h3>{characterData.name}</h3>
              <p>
                {characterData.race} {characterData.active_spec_name}{" "}
                {characterData.class}
              </p>
              {characterData.guild && (
                <p>
                  <span className="font-semibold">Guild</span>:{" "}
                  {characterData.guild.name}
                </p>
              )}
              <p className="text-sm">
                Last updated:{" "}
                {characterData.last_crawled_at &&
                  new Date(characterData.last_crawled_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3>Current Season Stats</h3>
              {characterData.mythic_plus_scores_by_season?.[0]?.scores?.all && (
                <p>
                  Score:{" "}
                  {characterData.mythic_plus_scores_by_season[0].scores.all}
                </p>
              )}
              <div>
                <ul>
                  Ranking:
                  {characterData.mythic_plus_ranks?.overall && (
                    <>
                      <li>
                        <span className="font-semibold">World</span>:{" "}
                        {characterData.mythic_plus_ranks.overall.world}
                      </li>
                      <li>
                        <span className="font-semibold">Region</span>:{" "}
                        {characterData.mythic_plus_ranks.overall.region}
                      </li>
                      <li>
                        <span className="font-semibold">Realm</span>:{" "}
                        {characterData.mythic_plus_ranks.overall.realm}
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h3>Top Runs of the Season</h3>
                <Accordion type="single" collapsible>
                  {characterData.mythic_plus_best_runs?.map((run: any) => (
                    <AccordionItem
                      key={run.keystone_run_id}
                      value={run.keystone_run_id}
                    >
                      <AccordionTrigger>
                        {run.dungeon} - {run.mythic_level} -{" "}
                        {new Date(run.completed_at).toLocaleDateString()}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Time: {(run.clear_time_ms / 60000).toFixed(2)} minutes
                        </p>
                        <p>Score: {run.score}</p>
                        <p className="flex gap-2">
                          Affixes:{" "}
                          {run.affixes.map((affix: any) => (
                            <span key={affix.id}>
                              <Link
                                to={affix.wowhead_url}
                                className="underline text-sm"
                              >
                                {affix.name}
                              </Link>
                            </span>
                          ))}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        ) : (
          <p>Search your character using the field above!</p>
        )}
      </section>
    </>
  );
}
