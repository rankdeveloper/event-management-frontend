import { EventHome } from "@/rowData";
import { motion } from "framer-motion";
import { child, parent } from "@/lib/animation-variants";

export default function InfoEvent() {
  return (
    <section className="py-20 px-4 sm:px-16 bg-gradient-to-br from-gray-900 to-indigo-950 relative overflow-hidden">
      {/* decorative */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">Why Evenza</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to run great events</h2>
        <p className="text-gray-400 mt-3 text-sm max-w-md mx-auto">
          Powerful tools designed to make event management effortless.
        </p>
      </motion.div>

      <motion.div
        variants={parent}
        initial="initial"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        {EventHome.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              variants={child}
              key={item.title}
              className="flex flex-col items-center text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
            >
              <div className="bg-indigo-500/20 border border-indigo-400/30 p-4 rounded-2xl mb-5 group-hover:bg-indigo-500/30 transition-colors">
                <Icon className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
