import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="text-sm text-center">
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <Link
          to="https://www.ryanfurrer.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ryan Furrer
        </Link>
      </p>
      <Link
        to="https://github.com/ryandotfurrer/rioplus"
        target="_blank"
        rel="noopener noreferrer"
      >
        View GitHub Repo
      </Link>
    </footer>
  );
}
