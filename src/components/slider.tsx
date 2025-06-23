import { useEffect } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import avatar from "../assets/avatar.jpg";
import "../App.css";

export const VerticalSlider = () => {
  useEffect(() => {
    const splide = new Splide(".splide", {
      direction: "ttb",
      height: "20rem",
      wheel: true,
      autoplay: true,
      interval: 3000,
      type: "loop",
      arrows: false,
      breakpoints: {
        400: {
          height: "27rem",
        },
      },
    });

    splide.mount();
  }, []);

  return (
    <div className="splide">
      <div className="splide__track !bg-indigo-500">
        <ul className="splide__list">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="splide__slide !py-6 text-center flex flex-col items-center !gap-6 bg-indigo-100"
            >
              <div className="h-24 w-24 object-cover">
                <img
                  src={avatar}
                  alt="image"
                  className="h-full w-full rounded-full  border-indigo-500 border-2"
                />
              </div>
              <p className="text-base px-4 xl:px-24 md:px-20  text-gray-500 font-medium">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis
                eligendi consectetur excepturi temporibus non atque, doloribus
                assumenda necessitatibus neque dolorem accusantium, consequuntur
                pariatur aliquid ipsam. Velit quod sint dolorem dicta.
              </p>

              <div>
                <h3 className="font-semibold">Kyle Jemmison</h3>
                <p className="text-gray-500">CEO, Evenza</p>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VerticalSlider;
