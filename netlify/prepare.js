import * as fsp from "node:fs/promises";
import * as fs from "node:fs";
import * as path from "node:path";

// Log the current directory and files
console.log("Current working directory:", process.cwd());
console.log("Files in current directory:", fs.readdirSync("."));

// Check if app/routes directory exists and log its contents
const routesDir = "app/routes";
if (fs.existsSync(routesDir)) {
  console.log(`Files in ${routesDir}:`, fs.readdirSync(routesDir));
} else {
  console.log(`Directory ${routesDir} does not exist!`);
}

// Check if the character.tsx file exists
const characterFilePath = path.join(routesDir, "character.tsx");
console.log(`Does ${characterFilePath} exist?`, fs.existsSync(characterFilePath));

// Continue with the original script
await fsp
  .rm(".netlify/functions-internal", { recursive: true })
  .catch(() => {});
await fsp.mkdir(".netlify/functions-internal", { recursive: true });
await fsp.cp("build/server/", ".netlify/functions-internal/handler", {
  recursive: true,
});

// .netlify/functions-internal
