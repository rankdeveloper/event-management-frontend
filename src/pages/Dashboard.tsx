import Chart from "react-apexcharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { events } from "../../lib/api";
import CounterNumber from "@/components/counter-number";
import { motion } from "framer-motion";
import { topToBottomChild, topToBottomParent } from "@/lib/animation-variants";
import NotFound from "@/components/not-found";
import { CheckCircle2, CalendarDays, Users, ArrowRight } from "lucide-react";

const statCards = (data: any) => [
  {
    label: "Completed Events",
    value: data?.completedEvents || 0,
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    label: "Total Events",
    value: data?.totalEvents || 0,
    icon: CalendarDays,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    label: "Total Attendees",
    value: data?.totalAttendees || 0,
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => events.getStats(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const chartOptions = {
    series: [
      data?.eventTypes?.length || 0,
      data?.activeEvents || 0,
      data?.completedEvents || 0,
      data?.totalExpiredEvents || 0,
      data?.totalEvents || 0,
    ],
    chart: { type: "pie" as const },
    labels: [
      "Event Types",
      "Active Events",
      "Completed Events",
      "Expired Events",
      "Total Events",
    ],
    colors: ["#6366f1", "#22c55e", "#a855f7", "#f59e0b", "#3b82f6"],
    legend: { position: "bottom" as const },
    responsive: [
      { breakpoint: 1024, options: { chart: { width: 260, height: 260 } } },
    ],
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 pt-10 gap-5 h-[90vh] px-4 xl:px-20">
      <div className="col-span-1 md:col-span-2 flex flex-col h-full gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards(data).map(
            ({ label, value, icon: Icon, color, bg, border }) => (
              <div
                key={label}
                className={`bg-white p-5 rounded-xl border ${border} shadow-sm flex items-center gap-4`}
              >
                <div className={`${bg} p-3 rounded-xl`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>
                    <CounterNumber value={value} />
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Upcoming events */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Upcoming Events
            </h3>
            <Link
              to="/events"
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <hr className="border-gray-100" />

          <div className="overflow-y-auto flex-1 mt-2">
            {data?.upComingEvents?.length > 0 ? (
              <Accordion type="multiple">
                <motion.div
                  variants={topToBottomParent}
                  initial="initial"
                  whileInView="visible"
                  key="upcoming-events"
                >
                  {data.upComingEvents.map((event: any, i: number) => (
                    <motion.div key={i} variants={topToBottomChild}>
                      <AccordionItem
                        value={`item-${i}`}
                        className="border-b border-gray-50"
                      >
                        <AccordionTrigger className="text-sm font-medium text-gray-800 hover:text-indigo-600 py-3">
                          <Link
                            to={`/events/${event._id}`}
                            className="text-left"
                          >
                            {event?.title || "-"}
                            {event?.category && (
                              <span className="ml-2 text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                                {event.category}
                              </span>
                            )}
                          </Link>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-500 pl-2 pb-3">
                          <p>{event?.description || "-"}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            📍 {event?.location} &nbsp;·&nbsp; 🗓{" "}
                            {event?.date
                              ? new Date(event.date).toLocaleString()
                              : ""}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </motion.div>
              </Accordion>
            ) : (
              <NotFound message="No Upcoming Events" />
            )}
          </div>
        </div>
      </div>

      <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
        <h3 className="text-base font-semibold text-gray-900">
          Event Statistics
        </h3>
        <hr className="border-gray-100" />
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <Chart
              options={chartOptions}
              series={chartOptions.series}
              type="pie"
              width="320"
            />
          </div>
        )}
      </div>
    </div>
  );
}
