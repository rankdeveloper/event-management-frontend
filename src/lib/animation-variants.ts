export const parent = {
  initial: { opacity: 0, delay: 3 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

export const child = {
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
