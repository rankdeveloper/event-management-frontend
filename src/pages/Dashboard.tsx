import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { events } from "../../lib/api";
import CounterNumber from "@/components/counter-number";
import { motion, AnimatePresence } from "framer-motion";
import { topToBottomChild, topToBottomParent } from "@/lib/animation-variants";
import NotFound from "@/components/not-found";
import {
  CheckCircle2,
  CalendarDays,
  Users,
  ArrowRight,
  PlusCircle,
  Ticket,
  Bookmark,
  Clock,
  Compass,
  LayoutDashboard,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Event, useAuthStore } from "../authStore";
import image1 from "../assets/image1.png";

type Tab = "upcoming" | "created" | "attending" | "bookmarks";

function EventRow({
  event,
  index,
  total,
}: {
  event: Event;
  index: number;
  total: number;
}) {
  return (
    <motion.div variants={topToBottomChild}>
      <Link
        to={`/events/${event._id}`}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50/60 transition-colors group border border-transparent hover:border-indigo-100"
      >
        <img
          src={event.image || image1}
          alt={event.title}
          className="h-12 w-12 rounded-xl object-cover shrink-0 ring-1 ring-gray-100"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = image1;
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {event.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {format(new Date(event.date), "MMM d, yyyy · h:mm a")} ·{" "}
            {event.location}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {event.category && (
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium border border-indigo-100">
              {event.category}
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              event.completed
                ? "bg-green-50 text-green-600 border border-green-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
            }`}
          >
            {event.completed ? "Completed" : "Active"}
          </span>
        </div>
      </Link>
      {index < total - 1 && <hr className="border-gray-50 mx-3" />}
    </motion.div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => events.getStats(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const { data: myEventsData, isLoading: myEventsLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: () => events.getMyEvents(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => events.getBookmarks(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const statCards = [
    {
      label: "Total Events",
      value: data?.totalEvents || 0,
      icon: CalendarDays,
      gradient: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      color: "text-indigo-600",
      border: "border-indigo-100",
    },
    {
      label: "Total Attendees",
      value: data?.totalAttendees || 0,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      color: "text-violet-600",
      border: "border-violet-100",
    },
    {
      label: "Completed Events",
      value: data?.completedEvents || 0,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  const quickActions = [
    {
      label: "Create Event",
      desc: "Host something new",
      icon: PlusCircle,
      to: "/createEvent",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      hover: "hover:bg-indigo-100",
    },
    {
      label: "Browse Events",
      desc: "Discover what's on",
      icon: Compass,
      to: "/events",
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      hover: "hover:bg-violet-100",
    },
    {
      label: "My Tickets",
      desc: "Events you're attending",
      icon: Ticket,
      to: "/my-tickets",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      hover: "hover:bg-emerald-100",
    },
  ];

  const chartOptions = {
    series: [
      data?.eventTypes?.length || 0,
      data?.activeEvents || 0,
      data?.completedEvents || 0,
      data?.totalExpiredEvents || 0,
      data?.totalEvents || 0,
    ],
    chart: { type: "pie" as const },
    labels: ["Event Types", "Active", "Completed", "Expired", "Total"],
    colors: ["#6366f1", "#22c55e", "#a855f7", "#f59e0b", "#3b82f6"],
    legend: { position: "bottom" as const, fontSize: "12px" },
    responsive: [
      { breakpoint: 1024, options: { chart: { width: 240, height: 240 } } },
    ],
  };

  const tabs: {
    key: Tab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    {
      key: "upcoming",
      label: "Upcoming",
      icon: Clock,
      count: data?.upComingEvents?.length || 0,
    },
    {
      key: "created",
      label: "Created",
      icon: CalendarDays,
      count: myEventsData?.created?.length || 0,
    },
    {
      key: "attending",
      label: "Attending",
      icon: Ticket,
      count: myEventsData?.attending?.length || 0,
    },
    {
      key: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
      count: bookmarksData?.bookmarks?.length || 0,
    },
  ];

  const tabContent: Record<
    Tab,
    { list: Event[]; loading: boolean; emptyMsg: string }
  > = {
    upcoming: {
      list: data?.upComingEvents || [],
      loading: isLoading,
      emptyMsg: "No upcoming events",
    },
    created: {
      list: myEventsData?.created || [],
      loading: myEventsLoading,
      emptyMsg: "No events created yet",
    },
    attending: {
      list: myEventsData?.attending || [],
      loading: myEventsLoading,
      emptyMsg: "Not attending any events",
    },
    bookmarks: {
      list: bookmarksData?.bookmarks || [],
      loading: bookmarksLoading,
      emptyMsg: "No bookmarked events",
    },
  };

  const current = tabContent[activeTab];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 pt-24 pb-16 px-4 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="h-4 w-4 text-indigo-200" />
              <span className="text-indigo-200 text-sm font-medium tracking-wide uppercase">
                Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              {greeting}
              {user?.username ? `, ${user.username}` : ""}! 👋
            </h1>
            <p className="text-indigo-200 mt-1 text-sm">
              Here's what's happening with your events today.
            </p>
          </div>
          <Link
            to="/createEvent"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors text-sm self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            New Event
          </Link>
        </div>
      </div>

      <div className="px-4 xl:px-20 mt-8 pb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon, bg, color, border }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl border ${border} shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}
            >
              <div className={`${bg} p-3.5 rounded-2xl`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {label}
                </p>
                <p className={`text-3xl font-bold ${color} leading-tight`}>
                  <CounterNumber value={value} />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map(
            ({ label, desc, icon: Icon, to, color, bg, border, hover }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 bg-white border ${border} rounded-2xl p-4 ${hover} transition-colors group shadow-sm`}
              >
                <div className={`${bg} p-2.5 rounded-xl`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${color}`}>{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <ArrowRight
                  className={`h-4 w-4 ${color} ml-auto opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </Link>
            ),
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-900">My Events</h3>
              <Link
                to="/createEvent"
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                <PlusCircle className="h-3.5 w-3.5" /> New Event
              </Link>
            </div>

            <div className="flex gap-1 bg-gray-50 p-1.5 mx-5 mt-4 rounded-xl overflow-x-auto">
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === key
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === key
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            <div className="overflow-y-auto max-h-[400px] px-2 py-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {current.loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    </div>
                  ) : current.list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <NotFound message={current.emptyMsg} />
                      {activeTab === "created" && (
                        <Link
                          to="/createEvent"
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                          Create your first event →
                        </Link>
                      )}
                      {(activeTab === "upcoming" ||
                        activeTab === "attending") && (
                        <Link
                          to="/events"
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                          Browse events →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      variants={topToBottomParent}
                      initial="initial"
                      animate="visible"
                    >
                      {current.list.map((event: Event, i: number) => (
                        <EventRow
                          key={event._id}
                          event={event}
                          index={i}
                          total={current.list.length}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Statistics</h3>
              <Link
                to="/events"
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                All Events <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <hr className="border-gray-50" />

            {isLoading ? (
              <div className="flex items-center justify-center flex-1 h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="pie"
                    width="260"
                  />
                </div>
                <hr className="border-gray-50" />

                <div className="space-y-2">
                  {[
                    {
                      label: "Active Events",
                      value: data?.activeEvents || 0,
                      color: "bg-green-500",
                    },
                    {
                      label: "Completed",
                      value: data?.completedEvents || 0,
                      color: "bg-purple-500",
                    },
                    {
                      label: "Upcoming",
                      value: data?.upComingEvents?.length || 0,
                      color: "bg-indigo-500",
                    },
                    {
                      label: "Expired",
                      value: data?.totalExpiredEvents || 0,
                      color: "bg-amber-400",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${color}`} />
                        <span className="text-gray-500">{label}</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
