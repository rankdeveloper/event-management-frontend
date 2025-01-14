import { Link } from "react-router-dom";
import { Calendar, Users, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-16 sm:py-20">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to eventCenter
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Create, manage, and join events with ease. Connect with people who
          share your interests.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <Calendar className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Create Events
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Easily create and manage your events with our intuitive
                interface.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Connect with Others
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Join events and connect with people who share your interests.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <MapPin className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Find Local Events
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Discover events happening in your area and get involved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
