import { useEffect, useState } from "react";
import type { Route } from "./+types/home";

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

export default function MythicPlus() {
  const [affixes, setAffixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAffixes() {
      try {
        const response = await fetch(
          "https://raider.io/api/v1/mythic-plus/affixes?access_key=RIO1irVueuVxGKwtqzZ91Ngzi&region=us&locale=en"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        console.log(data.title);
        setAffixes(data.title);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffixes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <header className="mb-8">
        <h1>Mythic+</h1>
        <p>This is the about page of my React Router sandbox project.</p>
      </header>

      <section>
        <h2>This Week's Affixes</h2>
        {affixes.length > 0 ? <p>{affixes}</p> : <p>No affixes found.</p>}
      </section>
    </>
  );
}
