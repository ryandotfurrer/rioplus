import { Form, Link } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Route } from "./+types/home";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { RealmCombobox } from "~/components/realm-combobox";
import { cn } from "~/lib/utils";
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
  const [rioData, setRioData] = useState({});
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
          setRioData(data);
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

  const fetchCharacter = useCallback(async () => {
    if (!region || !realm || !characterName) {
      setCharacterError(new Error("Please provide all required fields."));
      return;
    }

    setCharacterLoading(true);
    setCharacterData(null);
    setCharacterError(null);
    try {
      const response = await fetch(
        `https://raider.io/api/v1/characters/profile?access_key=RIO1irVueuVxGKwtqzZ91Ngzi&region=${region}&realm=${realm}&name=${characterName}&fields=gear%2Ctalents%3Acategorized%2Cguild%2Craid_progression%2Cmythic_plus_scores_by_season%3Acurrent%2Cmythic_plus_ranks%2Cmythic_plus_recent_runs%2Cmythic_plus_best_runs%3Aall`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCharacterData(data);
    } catch (error) {
      setCharacterError(error as Error);
    } finally {
      setCharacterLoading(false);
    }
  }, [region, realm, characterName]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchCharacter();
  };

  return (
    <>
      <header className="mb-8">
        <h1>Mythic+</h1>
        <p>See this week's affixes and learn more about them!</p>
      </header>
      <AffixCards />
      <section className="space-y-4 mb-8">
        <h2>Character Lookup</h2>
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="mb-4 grid grid-cols-1 gap-2 w-full md:w-1/3"
        >
          <div className="grid gap-2">
            <Select name="region" value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Regions</SelectLabel>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="EU">EU</SelectItem>
                  <SelectItem value="KR">KR</SelectItem>
                  <SelectItem value="TW">TW</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <RealmCombobox region={region} realm={realm} onChange={setRealm} />
          </div>
          <div className="">
            <label htmlFor="character">Character:</label>
            <Input
              type="text"
              id="character"
              name="character"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name"
              required
            />
          </div>
          <div>
            <Button
              className="w-full"
              size={"lg"}
              type="submit"
              {...(characterLoading ? { disabled: true } : {})}
            >
              Fetch Character
            </Button>
          </div>
        </Form>
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
                  {characterData.mythic_plus_best_runs?.map((run) => (
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
                          {run.affixes.map((affix) => (
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
