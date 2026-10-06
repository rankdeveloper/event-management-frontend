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
import { useQuery } from "@tanstack/react-query";
import { events } from "../../lib/api";
import CounterNumber from "@/components/counter-number";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["stats-data"],
    queryFn: () => events.homeStat(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const stats = [
    {
      number: data?.totalEvents || 0,
      title: " Total events created",
    },
    {
      number: data?.completedEvents || 0,
      title: "Total events completed successfully",
    },
    {
      number: data?.totalAttendees || 0,
      title: "Total attendees",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="w-full  h-full ">
        <div className="text-center py-20 sm:py-28 px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-100"
          >
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Trusted by 10,000+ organizers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120, delay: 0.4 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-6xl lg:text-7xl tracking-tight sm:px-16 leading-tight"
          >
            Transforming Occasions Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Great Memories
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120, delay: 0.8 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed"
          >
            Evenza helps individuals and teams organize successful events with smart tools and a user-friendly experience.
          </motion.p>
          <div className="mt-10 flex items-center flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.1 }}
            >
              <Link
                to="/createEvent"
                className="inline-flex items-center px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                Create Your Event
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <Link
                to="/events"
                className="inline-flex items-center px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-base font-semibold rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-y-0.5"
              >
                Browse Events
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mb-12 mt-4 sm:px-16 px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">Explore Event Categories</h2>
          <motion.div
            variants={parent}
            initial="initial"
            key="events-types"
            animate={"visible"}
            className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {EVENTS_GALLERY.map((item, i) => (
              <motion.div
                variants={child}
                key={i}
                className="relative h-[180px] 2xl:h-[260px] overflow-hidden rounded-2xl group cursor-pointer"
              >
                <img
                  src={item.url}
                  alt="image"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-0 right-0 text-center text-white font-semibold text-sm uppercase tracking-wide">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "keyframes", stiffness: 120, duration: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 xl:gap-16 mb-8"
        >
          {stats?.map((item, i) => (
            <div
              key={i}
              className={`w-[80%] sm:w-auto text-center py-2 sm:py-6 px-4 sm:px-8   ${
                i == 1 ? "border border-y-0 border-x-2 border-indigo-300" : ""
              } `}
            >
              <h3 className="text-3xl sm:text-4xl 2xl:text-5xl font-bold">
                <CounterNumber value={item.number} />+
              </h3>
              <p className="text-base mt-2 text-gray-500">{item.title}</p>
            </div>
          ))}
        </motion.div>

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
