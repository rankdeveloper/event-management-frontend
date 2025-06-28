import { child, parent } from "@/lib/animation-variants";
import { trustedBy_icons } from "@/rowData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
export default function TRUSTED_BY() {
  return (
    <div className="flex sm:flex-row flex-col gap-4 sm:gap-0  items-center justify-between bg-white py-8 w-full border-b-gray-300 border border-t-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "keyframes", stiffness: 120, duration: 1 }}
        className="sm:w-1/4 w-full "
      >
        <h3 className="!float-none text-center  sm:float-right text-xl font-semibold">
          Trusted Partners :{" "}
        </h3>
      </motion.div>
      <motion.div
        variants={parent}
        initial="initial"
        key="trusted-by"
        whileInView={"visible"}
        transition={{ delay: 0.5 }}
        className="flex gap-14 items-center justify-center max-w-3xl sm:max-w-5xl 2xl:max-w-7xl mx-auto text-2xl sm:text-5xl 2xl:text-6xl text-gray-500"
      >
        {trustedBy_icons.map((item, i) => (
          <motion.div variants={child} key={i}>
            <FontAwesomeIcon
              key={i}
              icon={item.icon}
              className={`${item.className}`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
