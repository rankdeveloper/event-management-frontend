import { EventHome } from "@/rowData";
import { motion } from "framer-motion";

export default function InfoEvent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "keyframes", stiffness: 120, duration: 1.5 }}
      className="py-20 2xl:py-32 backgroundImg px-4 sm:px-6 lg:px-24  "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {EventHome.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="text-center border border-indigo-400 rounded-lg filter drop-shadow-lg backdrop-blur py-4"
              >
                <div className="flex justify-center">
                  <Icon className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-base text-white">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
