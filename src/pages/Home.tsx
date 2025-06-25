import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import VerticalSlider from "@/components/slider";
import { EVENTS_GALLERY } from "@/rowData";
import Footer from "@/components/footer";
import { child, parent } from "@/lib/animation-variants";
import Help from "@/components/Help";
import FAQ from "@/components/faq";
import TRUSTED_BY from "@/components/trusted-by";
import InfoEvent from "@/components/events-info";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="w-full  h-full ">
        <div className="text-center py-16 sm:py-20   ">
          <motion.h1
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="text-2xl uppercase font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl xl:text-7xl px:2 sm:px-32  "
          >
            Transforming Occasions Into Great Memories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 120,
              delay: 0.5,
            }}
            className="mt-5 max-w-full sm:max-w-2xl mx-auto text-xl text-gray-500"
          >
            Our mission is to make event planning simple, efficient, and
            stress-free. Evenza helps individuals and teams organize successful
            events with smart tools and a user-friendly experience.
          </motion.p>

          <div className="mt-8 flex items-center flex-col sm:flex-row gap-4 sm:gap-10 justify-center ">
            <div className=" w-[90%] sm:w-[20%] border bg-indigo-600 hover:bg-indigo-700">
              <Link
                to="/createEvent"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white "
              >
                Create Your Event
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-12 mt-4 sm:px-16 px-2">
          <motion.div
            variants={parent}
            initial="initial"
            key="events-types"
            whileInView="visible"
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4  gap-4"
          >
            {EVENTS_GALLERY.map((item, i) => (
              <motion.div
                variants={child}
                key={i}
                className="h-[200px] w-full sm:w-[300px]  2xl:w-[400px] 2xl:h-[300px] overflow-hidden object-cover relative rounded-lg"
              >
                <img
                  src={item.url}
                  alt="image"
                  className="h-full w-full rounded-lg border hover:scale-125 transition-all duration-500 "
                />
                <span className=" bg-white w-1/3  absolute  bottom-5 left-0 right-0 text-center text-indigo-500 uppercase font-bold text-sm mt-2  py-1  rounded-xl mx-auto  ">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 xl:gap-16 mb-8">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className={`w-[80%] sm:w-auto text-center py-2 sm:py-6 px-4 sm:px-8   ${
                i == 1 ? "border border-y-0 border-x-2 border-indigo-300" : ""
              } `}
            >
              <h3 className="text-3xl sm:text-4xl 2xl:text-5xl font-bold">
                100+
              </h3>
              <p className="text-base mt-2 text-gray-500">
                Total events completed successfully
              </p>
            </div>
          ))}
        </div>

        <InfoEvent />
      </div>

      <VerticalSlider />
      <Help />
      <FAQ />
      <TRUSTED_BY />
      <Footer />
    </div>
  );
}
