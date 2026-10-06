import { useEffect } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import avatar from "../assets/avatar.jpg";
import "../App.css";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Kyle Davis",
    role: "Event Director, New York",
    text: "Evenza helped us streamline our event planning from start to finish. The platform is intuitive, reliable, and has made our team's workflow significantly more efficient.",
  },
  {
    name: "Sarah Mitchell",
    role: "Community Manager, London",
    text: "We've tried many event tools, but Evenza stands out for its simplicity and power. Our attendee satisfaction scores went up 40% after switching.",
  },
];

export const VerticalSlider = () => {
  useEffect(() => {
    const splide = new Splide(".splide", {
      direction: "ttb",
      height: "22rem",
      wheel: true,
      autoplay: true,
      interval: 3500,
      type: "loop",
      arrows: false,
      pagination: false,
    });
    splide.mount();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="splide max-w-2xl mx-auto px-4"
    >
      <div className="splide__track rounded-2xl overflow-hidden">
        <ul className="splide__list">
          {testimonials.map((item, i) => (
            <li key={i} className="splide__slide">
              <div className="flex flex-col items-center text-center gap-5 py-10 px-6 sm:px-16 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl h-full">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-base leading-relaxed font-medium max-w-lg">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={avatar}
                    alt={item.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default VerticalSlider;
