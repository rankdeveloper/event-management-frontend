import { child, parent } from "@/lib/animation-variants";
import { trustedBy_icons } from "@/rowData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default function TRUSTED_BY() {
  return (
    <section className="py-12 px-4 bg-white border-t border-gray-100">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8"
      >
        Trusted by teams at
      </motion.p>
      <motion.div
        variants={parent}
        initial="initial"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-8 sm:gap-14"
      >
        {trustedBy_icons.map((item, i) => (
          <motion.div
            variants={child}
            key={i}
            className="text-3xl sm:text-4xl text-gray-300 hover:text-gray-500 transition-colors duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={item.icon} className={item.className} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
