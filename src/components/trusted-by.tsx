import { trustedBy_icons } from "@/rowData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TRUSTED_BY() {
  return (
    <div className="flex sm:flex-row flex-col gap-4 sm:gap-0  items-center justify-between bg-white py-8 w-full border-b-gray-300 border border-t-0">
      <div className="sm:w-1/4 w-full ">
        <h3 className="!float-none text-center  sm:float-right text-xl font-semibold">
          Trusted Partners :{" "}
        </h3>
      </div>
      <div className="flex gap-14 items-center justify-center max-w-3xl sm:max-w-5xl 2xl:max-w-7xl mx-auto text-2xl sm:text-5xl 2xl:text-6xl text-gray-500">
        {trustedBy_icons.map((item, i) => (
          <FontAwesomeIcon
            key={i}
            icon={item.icon}
            className={`${item.className}`}
          />
        ))}
      </div>
    </div>
  );
}
