import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { cn, getClassColorClass } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  const { region, realm, name } = params;

  try {
    const response = await fetch(
      `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}&fields=gear,talents:categorized,guild,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_ranks,mythic_plus_recent_runs,mythic_plus_best_runs:all`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { characterData: data, error: null };
  } catch (error) {
    return { characterData: null, error: (error as Error).message };
  }
}

interface CharacterData {
  name: string;
  race: string;
  class: string;
  active_spec_name: string;
  gear: {
    item_level_equipped: number;
  };
  profile_url: string;
  thumbnail_url: string;
  guild?: {
    name: string;
  };
  mythic_plus_scores_by_season: {
    season: string;
    scores: {
      all: number;
    };
  }[];
  raid_progression: {
    "liberation-of-undermine": {
      summary: string;
      total_bosses: number;
      normal_bosses_killed: number;
      heroic_bosses_killed: number;
      mythic_bosses_killed: number;
    };
    "blackrock-depths": {
      summary: string;
      total_bosses: number;
      normal_bosses_killed: number;
      heroic_bosses_killed: number;
      mythic_bosses_killed: number;
    };
    "nerubar-palace": {
      summary: string;
      total_bosses: number;
      normal_bosses_killed: number;
      heroic_bosses_killed: number;
      mythic_bosses_killed: number;
    };
  };
}

export default function CharacterPage() {
  const { characterData, error } = useLoaderData<{
    characterData: CharacterData | null;
    error: string | null;
  }>();

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!characterData) {
    return <div>Loading character data...</div>;
  }

  console.log(
    "Class color for",
    characterData.class,
    getClassColorClass(characterData.class)
  );

  return (
    <section className="container py-8">
      <article className="bg-card text-card-foreground rounded-lg border shadow p-4 space-y-4">
        <section>
          <h1>{characterData.name}</h1>
          <div>
            <p>
              {characterData.race}{" "}
              <span
                className={cn(
                  "font-semibold",
                  getClassColorClass(characterData.class)
                )}
              >
                {characterData.active_spec_name} {characterData.class}
              </span>
            </p>

            <p>
              Item Level: {characterData.gear.item_level_equipped.toFixed(2)}
            </p>
            {characterData.guild && (
              <p>
                <p>&lt;{characterData.guild.name}&gt;</p>
              </p>
            )}
          </div>
        </section>

        <section>
          <h2>Mythic+ Rating</h2>
          {characterData.mythic_plus_scores_by_season &&
          characterData.mythic_plus_scores_by_season[0] ? (
            <div className="text-lg font-medium">
              Score:{" "}
              {characterData.mythic_plus_scores_by_season[0].scores.all.toFixed(
                2
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">
              No Mythic+ data available
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2>Raid Progression</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(characterData.raid_progression).map(
              ([raidKey, raidData]) =>
                raidData.summary && (
                  <div
                    key={raidKey}
                    className="p-3 rounded-md border bg-secondary/50"
                  >
                    <h3 className="font-medium capitalize">
                      {raidKey.replace(/-/g, " ")}
                    </h3>
                    <p className="text-lg font-bold">{raidData.summary}</p>
                    <div className="mt-2 text-sm">
                      <p>
                        Normal: {raidData.normal_bosses_killed}/
                        {raidData.total_bosses}
                      </p>
                      <p>
                        Heroic: {raidData.heroic_bosses_killed}/
                        {raidData.total_bosses}
                      </p>
                      <p>
                        Mythic: {raidData.mythic_bosses_killed}/
                        {raidData.total_bosses}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </section>

        <footer className="mt-8 border-t pt-4">
          <a
            href={characterData.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View full profile on Raider.IO
          </a>
        </footer>
      </article>
    </section>
  );
}
