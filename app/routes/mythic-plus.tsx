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
import { Select } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { RegionCombobox } from "~/components/region-combobox";
import { RealmCombobox } from "~/components/realm-combobox";
import { cn } from "~/lib/utils";

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
  class: string;
  active_spec_name: string;
  name: string;
  race: string;
}

export default function MythicPlus() {
  const [isMobile, setIsMobile] = useState(true);
  const [rioData, setRioData] = useState({});
  const [affixes, setAffixes] = useState<Affix[]>([]);
  const [affixesLoading, setAffixesLoading] = useState(true);
  const [affixesError, setAffixesError] = useState<Error | null>(null);
  const [region, setRegion] = useState("");
  const [realm, setRealm] = useState("");
  const [characterName, setCharacterName] = useState("");
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
    setCharacterLoading(true);
    setCharacterData(null);
    setCharacterError(null);
    try {
      const response = await fetch(
        `https://raider.io/api/v1/characters/profile?access_key=RIO1irVueuVxGKwtqzZ91Ngzi&region=${region}&realm=${realm}&name=${characterName}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCharacterData(data);
    } catch (error) {
      setCharacterError(error as Error); // Use the character error state
    } finally {
      setCharacterLoading(false);
    }
  }, [region, realm, characterName]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetchCharacter();
  };

  return (
    <>
      <header className="mb-8">
        <h1>Mythic+</h1>
        <p>See this week's affixes and learn more about them!</p>
      </header>

      <section className="space-y-4 mb-8">
        <h2>This Week's Affixes</h2>
        {affixesLoading ? (
          <p>Loading Affixes...</p>
        ) : affixesError ? (
          <p>Error: {affixesError.message}</p> // Display affixes error
        ) : affixes.length > 0 ? (
          <section className="gap-4 grid grid-cols-1 md:grid-cols-2 bg-ruby-300">
            {affixes.map((affix, index) => (
              <div key={affix.id}>
                <details
                  className={cn(
                    "border rounded p-4 group text-background dark:shadow-none",
                    index === 0 &&
                      "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-400 border-indigo-200/50 shadow shadow-indigo-400",
                    index === 1 &&
                      "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 dark:from-amber-300 dark:via-yellow-300 dark:to-amber-400 border-amber-200/50 shadow shadow-amber-400",
                    index === 2 &&
                      "bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 dark:from-orange-300 dark:via-red-300 dark:to-orange-400 border-orange-200/50 shadow shadow-orange-400",
                    index === 3 &&
                      "bg-gradient-to-r from-red-500 via-pink-500 to-red-600 dark:from-red-300 dark:via-pink-300 dark:to-red-400 border-red-200/50 shadow shadow-red-400"
                  )}
                >
                  <summary className="mb-1 font-semibold flex items-center cursor-pointer">
                    {affix.name}
                    <span className="ml-auto">
                      +{index === 0 && "4"}
                      {index === 1 && "7"}
                      {index === 2 && "10"}
                      {index === 3 && "12"}
                    </span>
                  </summary>
                  <p className="text-pretty">
                    {affix.description}{" "}
                    <Link to={affix.wowhead_url} className="underline text-sm">
                      View on Wowhead
                    </Link>
                  </p>
                </details>
              </div>
            ))}
          </section>
        ) : (
          <p>No affixes found.</p>
        )}
      </section>
      <section className="space-y-4 mb-8">
        <h2>Character Information</h2>
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="mb-4 grid grid-cols-1 gap-2 w-full md:w-1/3"
        >
          <div className="grid gap-2">
            <RegionCombobox region={region} onChange={setRegion} />
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
          </p> // Display character error
        ) : characterData ? (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h3>{characterData.name}</h3>
              <p>
                {characterData.race} {characterData.active_spec_name}{" "}
                {characterData.class}
              </p>
            </div>
          </div>
        ) : (
          <p>Search your character using the field above!</p>
        )}
      </section>
    </>
  );
}
