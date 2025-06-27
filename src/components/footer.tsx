import { SOCIAL_ICONS } from "@/rowData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar } from "lucide-react";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white mt-auto py-6  md:w-[100%] w-full mx-auto px-4 xl:px-16">
      <div className=" flex flex-col  md:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:items-start items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">Evenza</span>
          </Link>
          <p className="text-[#bdbdbd] text-sm md:text-base text-center md:text-left ">
            © 2025 Evenza. All rights reserved.
          </p>
        </div>
        <div>
          <SocialLinks />
          <p className="text-[#bdbdbd] text-sm md:text-base text-center md:text-left ">
            Designed & developed by{" "}
            <a href="https://github.com/rankdeveloper" target="_blank">
              <span className="text-indigo-600  hover:text-indigo-700 hover:font-medium">
                Rankush
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

const SocialLinks = () => {
  return (
    <div className="flex gap-4 items-center justify-center ">
      {SOCIAL_ICONS.map((item, i) => (
        <div key={i} className="p-[2px] rounded-md">
          <a href={item.link} target="_blank">
            <FontAwesomeIcon
              icon={item.icon}
              className=" bg-white text-3xl hover:text-gray-500 transition-all duration-300  text-indigo-600 rounded-md cursor-pointer"
            />
          </a>
        </div>
      ))}
    </div>
  );
};
