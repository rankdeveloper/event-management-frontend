import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeadphonesIcon, Clock, Mail } from "lucide-react";

const supportFeatures = [
  { icon: HeadphonesIcon, label: "24/7 Support", desc: "Always available for urgent requests" },
  { icon: Clock, label: "10 min Response", desc: "Average first response time" },
  { icon: Mail, label: "Multi-channel", desc: "Chat, email, or phone" },
];

export default function Help() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-20 px-4 sm:px-16 bg-gradient-to-br from-indigo-600 to-violet-700 overflow-hidden relative"
    >
      {/* decorative blob */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-3 block">Support</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            99.99% uptime.{" "}
            <span className="underline underline-offset-4 decoration-indigo-300">10 min</span>{" "}
            response time.
          </h2>
          <p className="text-indigo-100 mt-5 text-base leading-relaxed max-w-md">
            Our highly-experienced support team is here to help. Available for chat, email, or phone — we're excited to help you get set up or answer any questions about Evenza.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors"
          >
            Try for free →
          </Link>
        </div>

        {/* Right — feature pills */}
        <div className="flex flex-col gap-4">
          {supportFeatures.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-indigo-200 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
