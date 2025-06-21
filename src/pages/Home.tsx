import { Link } from "react-router-dom";
import { Calendar, Users, MapPin } from "lucide-react";
import avatar from "../assets/avatar.jpg";
import image1 from "../assets/image1.png";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const parent: Variants = {
    initial: { opacity: 0 },
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

  const child: Variants = {
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

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="w-full  h-full ">
        <div className="text-center py-16 sm:py-20   ">
          <motion.h1
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="text-2xl uppercase font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl px:2 sm:px-32  "
          >
            Transforming Occasions Into Great Memories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 120,
              delay: 0.5,
            }}
            className="mt-5 max-w-full sm:max-w-2xl mx-auto text-xl text-gray-500"
          >
            Our mission is to make event planning simple, efficient, and
            stress-free. Evenza helps individuals and teams organize successful
            events with smart tools and a user-friendly experience.
          </motion.p>

          <div className="mt-8 flex items-center flex-col sm:flex-row gap-4 sm:gap-10 justify-center ">
            <div className=" w-[90%] sm:w-[15%] border bg-indigo-600 hover:bg-indigo-700">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white "
              >
                Subscribe
              </Link>
            </div>

            <div className="w-[90%] sm:w-[20%] border border-indigo-400 text-black bg-white hover:bg-indigo-300">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3  text-base font-medium rounded-md "
              >
                Create Your Event
              </Link>
            </div>
          </div>
        </div>

        {/* //types of events */}

        <div className="w-full mb-12 mt-4 sm:px-16 px-2">
          <motion.div
            variants={parent}
            initial="initial"
            key="events-types"
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="grid grid-cols-1 md:grid-cols-3  sm:grid-cols-4  gap-4 "
          >
            {[1, 2, 3].map((_, i) => (
              <motion.div
                variants={child}
                key={i}
                className="h-[250px] md:h-[200px]  w-full  sm:w-[250px] md:w-[300px]  xl:w-[350px] object-cover relative"
              >
                <img
                  src={image1}
                  alt="image"
                  className="h-full w-full rounded-lg border "
                />
                <span className=" absolute  bottom-5 left-0 right-0 text-center text-indigo-500 uppercase font-bold text-sm mt-2  py-1  rounded-xl mx-auto  ">
                  Sports
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 xl:gap-16 mb-8">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className={`w-[80%] sm:w-auto text-center py-2 sm:py-6 px-4 sm:px-8   ${
                i == 1 ? "border border-y-0 border-x-2 border-indigo-300" : ""
              } `}
            >
              <h3 className="text-2xl sm:text-4xl font-bold">100+</h3>
              <p className="text-base mt-2">
                Total events completed successfully
              </p>
            </div>
          ))}
        </div>

        <div className="py-20 backgroundImg px-4 sm:px-6 lg:px-24  ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center border border-indigo-400 rounded-lg filter drop-shadow-lg backdrop-blur py-4 ">
                <div className="flex justify-center">
                  <Calendar className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  Create Events
                </h3>
                <p className="mt-2 text-base text-white">
                  Easily create and manage your events with our intuitive
                  interface.
                </p>
              </div>
              <div className="text-center border border-indigo-400 rounded-lg filter drop-shadow-lg backdrop-blur py-4 ">
                <div className="flex justify-center">
                  <Users className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  Connect with Others
                </h3>
                <p className="mt-2 text-base text-white">
                  Join events and connect with people who share your interests.
                </p>
              </div>
              <div className="text-center border border-indigo-400 rounded-lg filter drop-shadow-lg backdrop-blur py-4 ">
                <div className="flex justify-center">
                  <MapPin className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Find Local Events
                </h3>
                <p className="mt-2 text-base text-white">
                  Discover events happening in your area and get involved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // whats user saying */}

      <div className="py-6 text-center flex flex-col items-center gap-6 bg-indigo-50">
        <div className="h-24 w-24 object-cover">
          <img
            src={avatar}
            alt="image"
            className="h-full w-full rounded-full border border-indigo-400"
          />
        </div>
        <p className="text-base px-4 xl:px-24 md:px-20">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis
          eligendi consectetur excepturi temporibus non atque, doloribus
          assumenda necessitatibus neque dolorem accusantium, consequuntur
          pariatur aliquid ipsam. Velit quod sint dolorem dicta.
        </p>

        <div>
          <h3 className="font-semibold">Kyle Jemmison</h3>
          <p>CEO, Evenza</p>
        </div>
      </div>

      <footer className="bg-white mt-auto py-6 border-t border-indigo-500 md:w-[100%] w-full mx-auto px-4 xl:px-16 ">
        <div className=" flex flex-col-reverse md:flex-row justify-between items-center">
          <p className="text-[#bdbdbd] text-sm md:text-base text-center md:text-left mt-4 md:mt-0">
            © 2024 GymFluencer. All rights reserved.
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}

const SocialLinks = () => {
  return (
    <div className="flex gap-4 items-center justify-center ">
      {[1, 2, 3, 4].map((i) => (
        <Calendar key={i} className="h-8 w-8 text-indigo-600 rounded-md" />
      ))}
    </div>
  );
};
