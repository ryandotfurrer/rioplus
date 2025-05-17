import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About" },
    { name: "description", content: "About this site." },
  ];
}

export default function About() {
  return (
    <>
      <header className="mb-8">
        <h1>About</h1>
        <p>This is the about page of my React Router sandbox project.</p>
      </header>
    </>
  );
}
