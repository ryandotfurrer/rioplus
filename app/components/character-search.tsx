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
import { Label } from "./ui/label";

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
        className="mb-4 grid grid-cols-4 gap-2 items-center"
      >
        <div className="grid gap-2">
          <Select name="region" value={region} onValueChange={setRegion}>
            <div>
              <Label htmlFor="region" className="pb-1">
                region
              </Label>
              <SelectTrigger id="region" className="w-full">
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
            </div>
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
          <RealmCombobox
            region={region}
            initialRealm={realm}
            onChange={setRealm}
          />
        </div>
        <div>
          <Label htmlFor="character" className="pb-1">
            Character
          </Label>
          <Input
            type="text"
            id="character"
            name="character"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
            className="placeholder:text-sm"
          />
        </div>
        <div className="pt-4">
          <Button className="w-full" type="submit">
            Search Character
          </Button>
        </div>
      </Form>
    </>
  );
}
