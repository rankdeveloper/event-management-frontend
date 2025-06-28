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
    <div className="sm:max-h-[600px] lg:max-h-[600px] overflow-y-scroll py-10 sm:px-0 px-4 ">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "keyframes", duration: 0.5 }}
        className="text-2xl sm:text-4xl font-semibold mb-4 uppercase"
      >
        Frequently Asked Questions
      </motion.h2>
      <Accordion type="multiple" className="sm:!w-[80vw]">
        <motion.div
          variants={topToBottomParent}
          initial="initial"
          whileInView="visible"
          key="upcoming-events"
        >
          {faq.map((item, i: number) => (
            <motion.div key={i} variants={topToBottomChild}>
              <AccordionItem key={i} value={`item-${i}`} className="">
                <AccordionTrigger className="underline-none text-base sm:text-xl font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="border-l-2 border-b border-gray-200 p-2 text-sm sm:text-base">
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
