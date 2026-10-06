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
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["stats-data"],
    queryFn: () => events.homeStat(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const stats = [
    { number: data?.totalEvents || 0, label: "Events Created", suffix: "+" },
    { number: data?.completedEvents || 0, label: "Successfully Completed", suffix: "+" },
    { number: data?.totalAttendees || 0, label: "Happy Attendees", suffix: "+" },
  ];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white pt-20">
        {/* background blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-indigo-100 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Trusted by 10,000+ organizers worldwide
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] max-w-4xl"
        >
          Transforming Occasions Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Great Memories
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed"
        >
          Evenza helps individuals and teams organize successful events with smart tools and a seamless experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3 justify-center"
        >
          <Link
            to="/createEvent"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
          >
            Create Your Event <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-base font-semibold rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-y-0.5"
          >
            Browse Events
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 bg-white border border-gray-100 rounded-2xl shadow-sm px-2 py-2 w-full max-w-2xl"
        >
          {stats.map(({ number, label, suffix }, i) => (
            <div key={i} className="flex flex-col items-center px-8 py-3 w-full sm:w-auto">
              <span className="text-3xl font-extrabold text-indigo-600">
                <CounterNumber value={number} />{suffix}
              </span>
              <span className="text-xs text-gray-500 mt-0.5 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Event Categories Gallery ── */}
      <section className="py-20 px-4 sm:px-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2 block">Categories</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Explore Event Categories</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            From music festivals to professional conferences — find the events that matter to you.
          </p>
        </motion.div>

        <motion.div
          variants={parent}
          initial="initial"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {EVENTS_GALLERY.map((item, i) => (
            <motion.div
              variants={child}
              key={i}
              className="relative h-[200px] overflow-hidden rounded-2xl group cursor-pointer shadow-sm"
            >
              <img
                src={item.url}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-white font-bold text-sm uppercase tracking-wider">{item.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features / Info ── */}
      <InfoEvent />

      {/* ── Testimonials ── */}
      <section className="py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 px-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Organizers Say</h2>
        </motion.div>
        <VerticalSlider />
      </section>

      {/* ── Help / Support ── */}
      <Help />

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-16 bg-gray-50/60">
        <FAQ />
      </section>

      {/* ── Trusted By ── */}
      <TRUSTED_BY />

      <Footer />
    </div>
  );
}
