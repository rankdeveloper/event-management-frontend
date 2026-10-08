import { SOCIAL_ICONS } from "@/rowData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link } from "react-router-dom";
import logo from "../../src/assets/logo.png";

const footerLinks = [
  { label: "Events", to: "/events" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Create Event", to: "/createEvent" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 xl:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <img src={logo} alt="Evenza Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Making event planning simple, efficient, and stress-free for
              everyone.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Connect
            </h4>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-base" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">
            © 2025 Evenza. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Designed & developed by{" "}
            <a
              href="https://github.com/rankdeveloper"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 hover:text-indigo-600 font-medium"
            >
              Rankush
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
