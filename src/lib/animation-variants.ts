import { Variants } from "framer-motion";

export const parent: Variants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      staggerChildren: 0.3,
      delayChildren: 0.2,
      delay: 0.5,
    },
  },
};

export const child: Variants = {
  initial: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export const topToBottomParent: Variants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      staggerChildren: 0.3,
      delayChildren: 0.2,
      delay: 0.5,
    },
  },
};

export const topToBottomChild: Variants = {
  initial: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};
