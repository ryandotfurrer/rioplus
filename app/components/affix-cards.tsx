import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";

interface Affix {
  id: number;
  name: string;
  description: string;
  wowhead_url: string;
  icon_url: string;
}

export default function AffixCards() {
  const [rioData, setRioData] = useState({});
  const [affixes, setAffixes] = useState<Affix[]>([]);
  const [affixesLoading, setAffixesLoading] = useState(true);
  const [affixesError, setAffixesError] = useState<Error | null>(null);

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

  return (
    <>
      {affixesLoading ? (
        <p>Loading Affixes...</p>
      ) : affixesError ? (
        <p>Error: {affixesError.message}</p>
      ) : affixes.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          {affixes.map((affix, index) => (
            <div key={affix.id}>
              <Accordion
                type="single"
                collapsible
                className="w-full group border rounded shadow-xs dark:shadow-none"
              >
                <AccordionItem value={affix.id.toString()}>
                  <AccordionTrigger className="px-4 py-3 font-semibold">
                    <span className="group-hover:underline">{affix.name}</span>
                    <span className="ml-auto mr-4 !underline-none">
                      +{index === 0 && "4"}
                      {index === 1 && "7"}
                      {index === 2 && "10"}
                      {index === 3 && "12"}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p className="text-pretty">
                      {affix.description}{" "}
                      <Link
                        to={affix.wowhead_url}
                        className="underline text-sm hover:text-accent-custom transition-colors"
                      >
                        View on Wowhead
                      </Link>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <p>No affixes found.</p>
      )}
    </>
  );
}
