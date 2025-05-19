import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="mb-8">
      <ul className="flex gap-4 items-center">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" end>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/mythic-plus" end>
            Mythic+
          </NavLink>
        </li>
        <li className="ml-auto">
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
}
