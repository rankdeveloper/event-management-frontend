import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/rowData";

export default function FAQ() {
  return (
    <div className="sm:max-h-[600px] lg:max-h-[600px] overflow-y-scroll py-10 sm:px-0 px-4 ">
      <h2 className="text-2xl sm:text-4xl font-semibold mb-4 uppercase">
        Frequently Asked Questions
      </h2>
      <Accordion type="multiple" className="sm:!w-[80vw]">
        {faq.map((item, i: number) => (
          <AccordionItem key={i} value={`item-${i}`} className="">
            <AccordionTrigger className="underline-none text-base sm:text-xl font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="border-l-2 border-b border-gray-200 p-2 text-sm sm:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
