import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
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

  if (error) toast.error("Error fetching events");

  const eventsList = data?.pages.flatMap((page) => page.events) || [];

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 xl:px-20 lg:px-8 py-8">
      <div className="flex justify-between items-center w-full py-4 border-b border-gray-100 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upcoming Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">{eventsList.length} events available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {eventsList.map((event: Event) => {
          const attendancePct = Math.min((event.attendees.length / event.maxAttendees) * 100, 100);
          const isFull = event.attendees.length >= event.maxAttendees;
          return (
            <motion.div
              key={event._id}
              layoutId={event._id}
              onClick={() => setSelectedId(event._id)}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="h-44 w-full overflow-hidden relative shrink-0">
                <img
                  src={event.image || image1}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = image1; }}
                />
                {event.category && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {event.category}
                  </span>
                )}
                {isFull && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Full
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2 h-10">{event.description}</p>
                </div>

                <div className="space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{format(new Date(event.date), "MMM d, yyyy · h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{event.attendees.length} / {event.maxAttendees}</span>
                    </div>
                    <span className={isFull ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                      {isFull ? "Full" : `${event.maxAttendees - event.attendees.length} spots left`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${isFull ? "bg-red-400" : "bg-indigo-500"}`}
                      style={{ width: `${attendancePct}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {isFetchingNextPage && (
          <div className="col-span-full flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        )}
      </div>

      {!isMobile && (
        <AnimatePresence>
          {selectedId && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                layoutId={selectedId}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const event = eventsList.find((e: any) => e._id === selectedId);
                  if (!event) return null;
                  return (
                    <Link to={`/events/${selectedId}`}>
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={event.image || image1}
                          alt={event.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = image1; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {event.category && (
                          <span className="absolute top-4 left-4 bg-white/90 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {event.category}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                          <span className="text-indigo-600 text-sm font-medium whitespace-nowrap ml-2">View details →</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-3">{event.description}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                            {format(new Date(event.date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-indigo-400" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {eventsList?.length === 0 && (
        <div className="h-full flex flex-col justify-center items-center text-center py-12">
          <div className="bg-indigo-50 rounded-full p-6 mb-4">
            <Calendar className="h-10 w-10 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No events yet</h3>
          <p className="text-gray-500 text-sm mb-4">Be the first to create an event!</p>
          <Link
            to="/createEvent"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Create Event
          </Link>
        </div>
      )}
    </div>
  );
}
