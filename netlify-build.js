import * as fs from 'node:fs';
import * as path from 'node:path';
import * as child_process from 'node:child_process';
import * as url from 'node:url';

// Get the directory where this script is located
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Log the start of the build process
console.log('Starting Netlify custom build script...');
console.log('Current working directory:', process.cwd());

// Check if app/routes directory exists
const routesDir = path.join(process.cwd(), 'app/routes');
if (!fs.existsSync(routesDir)) {
  console.error(`Error: Directory ${routesDir} does not exist!`);
  fs.mkdirSync(routesDir, { recursive: true });
  console.log(`Created directory: ${routesDir}`);
}

// Ensure character.tsx exists in the routes directory
const characterFilePath = path.join(routesDir, 'character.tsx');
if (!fs.existsSync(characterFilePath)) {
  console.log(`Character file not found at ${characterFilePath}, creating it...`);
  
  // Get source file path - using the version from our repo
  const sourceCharacterPath = path.join(process.cwd(), 'app/routes/character.tsx');
  if (fs.existsSync(sourceCharacterPath)) {
    // Copy from our repo's version
    fs.copyFileSync(sourceCharacterPath, characterFilePath);
    console.log(`Copied character.tsx from ${sourceCharacterPath}`);
  } else {
    // Create a minimal version if source doesn't exist
    const minimalCharacterContent = `
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { region, realm, name } = params;
  
  try {
    const response = await fetch(
      \`https://raider.io/api/v1/characters/profile?region=\${region}&realm=\${realm}&name=\${name}&fields=gear,talents:categorized,guild,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_ranks,mythic_plus_recent_runs,mythic_plus_best_runs:all\`
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return { characterData: data, error: null };
  } catch (error) {
    return { characterData: null, error: (error as Error).message };
  }
}

export default function CharacterPage() {
  const { characterData, error } = useLoaderData<{ characterData: any | null; error: string | null }>();
  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  if (!characterData) {
    return <div>Loading character data...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">{characterData.name}</h1>
      <div className="mt-4">
        <p>{characterData.race} {characterData.active_spec_name} {characterData.class}</p>
        <p>Item Level: {characterData.gear?.item_level_equipped}</p>
        {characterData.guild && <p>Guild: {characterData.guild.name}</p>}
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(characterFilePath, minimalCharacterContent);
    console.log(`Created minimal character.tsx file`);
  }
}

// Log the files in routes directory
console.log(`Files in ${routesDir}:`, fs.readdirSync(routesDir));

// Run the react-router build command
console.log('Running react-router build...');
try {
  child_process.execSync('react-router build', { stdio: 'inherit' });
  console.log('react-router build completed successfully');
} catch (error) {
  console.error('Error during react-router build:', error);
  process.exit(1);
}

// Run the netlify prepare script
console.log('Running netlify prepare script...');
try {
  // Import and run the prepare script
  await import('./netlify/prepare.js');
  console.log('netlify prepare script completed successfully');
} catch (error) {
  console.error('Error during netlify prepare script:', error);
  process.exit(1);
}

console.log('Build process completed successfully');