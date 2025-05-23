import { type RouteConfig, index, route } from "@react-router/dev/routes";
import * as fs from "node:fs";
import * as path from "node:path";

// Check if the character.tsx file exists
const characterPath = path.join(process.cwd(), "app/routes/character.tsx");
if (!fs.existsSync(characterPath)) {
  console.error(`ERROR: Character file not found at ${characterPath}`);
  // Create a log of what files do exist
  const routesDir = path.join(process.cwd(), "app/routes");
  if (fs.existsSync(routesDir)) {
    console.log(`Files in routes directory:`, fs.readdirSync(routesDir));
  } else {
    console.log(`Routes directory does not exist at ${routesDir}`);
  }
}

export default [
    index("routes/home.tsx"), 
    route("about", "routes/about.tsx"), 
    route("mythic-plus", "routes/mythic-plus.tsx"),
    route("character/:region/:realm/:name", "routes/character.tsx")
] satisfies RouteConfig;
