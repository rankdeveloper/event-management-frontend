import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div className="sm:min-h-[80vh]   items-center flex justify-end py-4 sm:py-0">
      <div className="help sm:h-[80vh] flex items-center justify-between sm:px-0 px-4">
        <div className="ml-0 sm:ml-[60%] flex flex-col justify-between  gap-8">
          <h2 className="text-2xl sm:text-5xl leading-tight font-bold">
            99.99% uptime. <br />{" "}
            <span className="underline-offset-8 underline ">10 min</span>{" "}
            response time.
          </h2>
          <p className="text-gray-500">
            Our highly-experienced support team is here to help. Available for
            chat, email or phone call support, we're excited to help you get
            setup or answer any questions you have about EventCreate. For
            immediate and urgent requests, we're available 24/7. For all other
            issues and onboarding support, we're available during normal
            business hours.
          </p>

          <div>
            <button className="bg-indigo-500 py-3 px-8 text-white inline hover:bg-white border-1 border-white hover:border hover:border-indigo-500 hover:text-indigo-500">
              <Link to="/register"> Try for free</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
