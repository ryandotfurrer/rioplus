import type { Route } from "./+types/home";
import { cn, getClassColorClass } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router Sandbox" },
    { name: "description", content: "My React Router sandbox project" },
  ];
}

export default function Home() {
  return (
    <>
      <h1>Welcome to my React Router sandbox project!</h1>
      <p>This is the home page of my React Router sandbox project.</p>
      <p>Click the about link above to learn more about this site.</p>

      {/* Class color samples */}
      <div className="p-4 my-8 bg-card border rounded-md">
        <h3 className="font-medium mb-2">WoW Class Colors A11y</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            "Death Knight",
            "Demon Hunter",
            "Druid",
            "Evoker",
            "Hunter",
            "Mage",
            "Monk",
            "Paladin",
            "Priest",
            "Rogue",
            "Shaman",
            "Warlock",
            "Warrior",
          ].map((className) => (
            <div key={className} className="flex items-center gap-2">
              <span
                className={cn("font-medium", getClassColorClass(className))}
              >
                {className}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
