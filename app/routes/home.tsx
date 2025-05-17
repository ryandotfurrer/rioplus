import type { Route } from "./+types/home";

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
    </>
  );
}
