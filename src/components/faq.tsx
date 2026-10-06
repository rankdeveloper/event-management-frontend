import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { topToBottomChild, topToBottomParent } from "@/lib/animation-variants";
import { faq } from "@/rowData";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2 block">FAQ</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-gray-500 mt-3 text-sm">Everything you need to know about Evenza.</p>
      </motion.div>

      <Accordion type="multiple">
        <motion.div
          variants={topToBottomParent}
          initial="initial"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faq.map((item, i) => (
            <motion.div key={i} variants={topToBottomChild}>
              <AccordionItem value={`item-${i}`} className="border border-gray-100 rounded-xl mb-2 px-1 shadow-sm bg-white">
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-gray-800 hover:text-indigo-600 px-4 py-4 [&>svg]:text-indigo-400">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 px-4 pb-4 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </motion.div>
      </Accordion>
    </div>
  );
}
