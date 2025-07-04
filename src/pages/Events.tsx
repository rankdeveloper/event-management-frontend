import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { events } from "../../lib/api";
import { Event } from "../authStore";
import image1 from "../assets/image1.png";

import toast from "react-hot-toast";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/isMobile";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Events() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["events"],
    queryFn: ({ pageParam = 1 }) => events.getEvents(pageParam, 8),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: true,
  });

  if (error) {
    toast.error("Error fetching events");
  }

  const eventsList = data?.pages.flatMap((page) => page.events) || [];

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 xl:px-20  lg:px-8 py-8 h-[90vh] flex flex-col  ">
      <div className="sticky top-0 z-10 bg-white flex justify-between items-center  mt-0 w-full py-4">
        <h1 className=" text-2xl font-bold text-gray-900">Upcoming Events</h1>
      </div>

      <div
        className={`overflow-y-auto   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
          eventsList.length <= 3
            ? "flex-1 xl:flex-none 2xl:flex-none"
            : "flex-1 lg:flex-none  2xl:flex-none"
        }`}
      >
        {eventsList.map((event: Event) => (
          <motion.div
            key={event._id}
            layoutId={event._id}
            onHoverStart={() => setSelectedId(event._id)}
            className="bg-white shadow-md  hover:shadow-lg transition-shadow duration-200 hover:border-indigo-600 hover:border-2 border-2 border-transparent"
          >
            <Link to={`/events/${event._id}`}>
              <div className="h-[200px] w-full shadow  overflow-hidden">
                <img
                  src={event.image || image1}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{format(new Date(event.date), "PPP")}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="h-5 w-5 mr-2" />
                    <span>
                      {event.attendees.length} / {event.maxAttendees} attendees
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {isFetchingNextPage && (
          <div className="col-span-full flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {!isMobile && (
        <AnimatePresence>
          {selectedId && (
            <motion.div
              layoutId={selectedId}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setSelectedId(null)}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { type: "spring", stiffness: 120, duration: 0.5 },
              }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-lg w-full max-w-xl 2xl:max-w-3xl px-4 py-6"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const event = eventsList.find(
                    (e: any) => e._id === selectedId
                  );
                  if (!event) return null;
                  return (
                    <>
                      <Link to={`/events/${selectedId}`}>
                        <img
                          src={event.image || image1}
                          alt={event.title}
                          className="h-64 w-full object-cover rounded"
                        />
                        <h3 className="text-2xl font-bold mt-4">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {event.description}
                        </p>
                      </Link>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {eventsList?.length == 0 && (
        <div className="h-full flex flex-col justify-center items-center text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500">
            <Link to="/createEvent">
              Create your first event to get started!
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
