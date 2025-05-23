import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

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
}

export default function CharacterPage() {
  const { characterData, error } = useLoaderData<{ characterData: CharacterData | null; error: string | null }>();
  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  if (!characterData) {
    return <div>Loading character data...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <img 
              src={characterData.thumbnail_url} 
              alt={characterData.name} 
              className="w-24 h-24 rounded-md border-2 border-primary"
            />
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{characterData.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2 text-muted-foreground">
              <span>{characterData.race}</span>
              <span>•</span>
              <span>{characterData.active_spec_name} {characterData.class}</span>
              <span>•</span>
              <span>Item Level: {characterData.gear.item_level_equipped}</span>
              {characterData.guild && (
                <>
                  <span>•</span>
                  <span>&lt;{characterData.guild.name}&gt;</span>
                </>
              )}
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Mythic+ Rating</h2>
              {characterData.mythic_plus_scores_by_season && characterData.mythic_plus_scores_by_season[0] ? (
                <div className="text-lg font-medium">
                  Score: {characterData.mythic_plus_scores_by_season[0].scores.all.toFixed(1)}
                </div>
              ) : (
                <div className="text-muted-foreground">No Mythic+ data available</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <a 
            href={characterData.profile_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View full profile on Raider.IO
          </a>
        </div>
      </div>
    </div>
  );
}