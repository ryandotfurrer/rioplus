import { useEffect, useState, useCallback, useRef } from "react";
import type { Route } from "./+types/home";
import { Form, Link } from "react-router";

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
  const [rioData, setRioData] = useState({});
  const [affixes, setAffixes] = useState<Affix[]>([]);
  const [affixesLoading, setAffixesLoading] = useState(true);
  const [affixesError, setAffixesError] = useState<Error | null>(null);
  const [realm, setRealm] = useState("");
  const [region, setRegion] = useState("us");
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
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {affixes.map((affix) => (
              <div>
                <details
                  key={affix.id}
                  className="border border-slate-400/50 rounded p-4 shadow-xs dark:shadow-none"
                >
                  <summary className="mb-1">{affix.name}</summary>
                  <p className="text-pretty">
                    {affix.description}
                    <Link
                      to={affix.wowhead_url}
                      className="underline text-sm block"
                    >
                      View on Wowhead
                    </Link>
                  </p>
                  <img
                    src={affix.icon_url}
                    alt=""
                    className="size-12 rounded my-1"
                  />
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p>No affixes found.</p>
        )}
      </section>
      <section>
        <h2>Character Information</h2>
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="mb-4 grid grid-cols-1 gap-2"
        >
          <div>
            <label htmlFor="region">Region:</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="border rounded p-1 block"
            >
              <option value="us">US</option>
              <option value="eu">EU</option>
            </select>
          </div>
          <div>
            <label htmlFor="realm">Realm:</label>
            <input
              type="text"
              id="realm"
              value={realm}
              onChange={(e) => setRealm(e.target.value)}
              className="border rounded p-1 block"
              required
            />
          </div>
          <div>
            <label htmlFor="character">Character:</label>
            <input
              id="character"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="border rounded p-1 block"
              required
            ></input>
          </div>
          <button
            type="submit"
            {...(characterLoading ? { disabled: true } : {})}
          >
            Fetch Character
          </button>
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
