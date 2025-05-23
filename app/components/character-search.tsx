import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "~/components/ui/select";
import { Form } from "react-router";
import { RealmCombobox } from "./realm-combobox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

// The action function is now defined in the route file (mythic-plus.tsx)

export default function CharacterSearch() {
  const [region, setRegion] = useState<string>("US");
  const [realm, setRealm] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");
  
  const handleSubmit = (event: React.FormEvent) => {
    // Check form validity before submitting
    if (!region || !realm || !characterName) {
      event.preventDefault();
      alert("Please provide all required fields.");
      return;
    }
  };
  return (
    <>
      <Form
        method="post"
        onSubmit={handleSubmit}
        className="mb-4 grid grid-cols-1 gap-2 w-full md:w-1/3"
      >
        <div className="grid gap-2">
          <Select name="region" value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Regions</SelectLabel>
                <SelectItem value="US">US</SelectItem>
                <SelectItem value="EU">EU</SelectItem>
                <SelectItem value="KR">KR</SelectItem>
                <SelectItem value="TW">TW</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <input type="hidden" name="realm" value={realm} />
          <RealmCombobox region={region} initialRealm={realm} onChange={setRealm} />
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

          >
            Search Character
          </Button>
        </div>
      </Form>
    </>
  );
}
