import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Search,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { events } from "../../lib/api";
import { Event } from "../authStore";
import image1 from "../assets/image1.png";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/isMobile";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "../authStore";
import { categories } from "../rowData";
import { useCountdown } from "@/hooks/useCountdown";

function CountdownBadge({ date }: { date: string }) {
  const time = useCountdown(date);
  if (!time)
    return <span className="text-xs text-red-400 font-medium">Ended</span>;
  if (time.days > 0)
    return (
      <span className="text-xs text-indigo-500 font-medium">
        {time.days}d {time.hours}h left
      </span>
    );
  return (
    <span className="text-xs text-orange-500 font-medium">
      {time.hours}h {time.mins}m left
    </span>
  );
}

export default function Events() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => events.getBookmarks(),
    enabled: !!user,
    onSuccess: (data: any) => {
      setBookmarkedIds(data.bookmarks.map((b: any) => b._id || b));
    },
  } as any);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["events", debouncedSearch, category, sort],
      queryFn: ({ pageParam = 1 }) =>
        events.getEvents(
          pageParam,
          8,
          debouncedSearch,
          category === "All" ? "" : category,
          sort,
        ),
      getNextPageParam: (lastPage: any) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
      refetchOnWindowFocus: true,
    });

  const bookmarkMutation = useMutation({
    mutationFn: (id: string) => events.toggleBookmark(id),
    onMutate: (id: string) => {
      setBookmarkedIds((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
      );
    },
    onSuccess: (data: any, _id: string) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(data.bookmarked ? "Event bookmarked!" : "Bookmark removed");
    },
    onError: (_: any, id: string) => {
      setBookmarkedIds((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
      );
      toast.error("Failed to update bookmark");
    },
  });

  const handleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Sign in to bookmark events");
      return;
    }
    if (user.isGuest) {
      toast.error("Guest users cannot bookmark events");
      return;
    }
    bookmarkMutation.mutate(id);
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 800
    ) {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const eventsList = data?.pages.flatMap((page: any) => page.events) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const handleShare = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event._id}`;
    if (navigator.share) {
      navigator.share({ title: event.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="mx-auto px-4 xl:px-20 lg:px-8 py-8 pt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount} events found
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters{" "}
          {(category !== "All" || sort !== "newest") && (
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
          )}
        </button>
      </div>

      {/* Search + Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-600"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-600"
              >
                <option value="newest">Soonest First</option>
                <option value="oldest">Latest First</option>
              </select>

              {(category !== "All" || sort !== "newest" || search) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setSort("newest");
                  }}
                  className="px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(category !== "All" || debouncedSearch) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {debouncedSearch && (
            <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
              "{debouncedSearch}"
              <button onClick={() => setSearch("")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {category !== "All" && (
            <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
              {category}
              <button onClick={() => setCategory("All")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {eventsList.map((event: Event) => {
              const attendancePct = Math.min(
                (event.attendees.length / event.maxAttendees) * 100,
                100,
              );
              const isFull = event.attendees.length >= event.maxAttendees;
              const isBookmarked = bookmarkedIds.includes(event._id);

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
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = image1;
                      }}
                    />
                    {event.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {event.category}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {isFull && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          Full
                        </span>
                      )}
                      <button
                        onClick={(e) => handleBookmark(e, event._id)}
                        className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${isBookmarked ? "bg-indigo-600 text-white" : "bg-white/90 text-gray-500 hover:text-indigo-600"}`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Bookmark className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                          {event.title}
                        </h3>
                        <CountdownBadge date={event.date} />
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2 h-10">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span className="truncate">
                          {format(new Date(event.date), "MMM d, yyyy · h:mm a")}
                        </span>
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
                          <span>
                            {event.attendees.length} / {event.maxAttendees}
                          </span>
                        </div>
                        <span
                          className={
                            isFull
                              ? "text-red-500 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          {isFull
                            ? "Full"
                            : `${event.maxAttendees - event.attendees.length} spots left`}
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

          {eventsList.length === 0 && (
            <div className="flex flex-col justify-center items-center text-center py-20">
              <div className="bg-indigo-50 rounded-full p-6 mb-4">
                <Calendar className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No events found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {debouncedSearch || category !== "All"
                  ? "Try adjusting your filters"
                  : "Be the first to create an event!"}
              </p>
              {!debouncedSearch && category === "All" && (
                <Link
                  to="/createEvent"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create Event
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
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
                  const event = eventsList.find(
                    (e: any) => e._id === selectedId,
                  );
                  if (!event) return null;
                  const isBookmarked = bookmarkedIds.includes(event._id);
                  return (
                    <>
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={event.image || image1}
                          alt={event.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = image1;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {event.category && (
                          <span className="absolute top-4 left-4 bg-white/90 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {event.category}
                          </span>
                        )}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={(e) => handleBookmark(e, event._id)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isBookmarked ? "bg-indigo-600 text-white" : "bg-white/90 text-gray-600 hover:text-indigo-600"}`}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleShare(e, event)}
                            className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-indigo-600 backdrop-blur-sm transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900">
                            {event.title}
                          </h3>
                          <CountdownBadge date={event.date} />
                        </div>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                          {event.description}
                        </p>
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
                        <Link
                          to={`/events/${selectedId}`}
                          className="mt-4 block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                          View Full Details →
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
