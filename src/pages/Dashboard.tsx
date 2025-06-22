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
export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ["stats-data"],
    queryFn: () => events.getStats(),
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const options = {
    series: [
      data?.eventTypes?.length,
      data?.activeEvents,
      data?.completedEvents,
      data?.totalEvents,
    ],
    chart: {
      width: 380,
      height: 380,
      type: "pie" as const,
    },
    labels: [
      "T. Events Types",
      "Active Events",
      "Completed Events",
      "Total Events",
    ],
    legend: {
      position: "bottom" as const,
      offsetY: 20,
    },
    responsive: [
      {
        breakpoint: 360,
        options: {
          chart: {
            width: 200,
            height: 200,
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            width: 270,
            height: 270,
          },
        },
      },
      {
        breakpoint: 1360,
        options: {
          chart: {
            width: 270,
            height: 270,
          },
        },
      },
    ],
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-3 pt-10  gap-4 h-[90vh]  px-4 xl:px-20">
        <div className="col-span-1 md:col-span-2 2xl:col-span-2 flex flex-col h-full  rounded-md px-2 py-4 shadow ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold">Active Events</h3>
              <p className="text-2xl font-bold">{data?.activeEvents || "-"}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold">Total Events</h3>
              <p className="text-2xl font-bold">{data?.totalEvents || "-"}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold">Total Attendees</h3>
              <p className="text-2xl font-bold">
                {data?.totalAttendees || "-"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex-1 h-full rounded-md  p-4 ">
            <div className="flex justify-between items-center mb-4 pb-2">
              <h3 className="text-lg font-bold  ">Upcoming Events</h3>
              <Link
                to="/events"
                className="text-indigo-500 hover:underline float-right"
              >
                View All
              </Link>
            </div>
            <hr />

            <div className="max-h-[600px] lg:max-h-[300px] overflow-y-scroll  ">
              <Accordion type="multiple">
                {data?.upComingEvents.map((event: any, i: number) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>
                      {event?.title || "-"} ({event?.category}){" "}
                    </AccordionTrigger>
                    <AccordionContent className="border-l-2 border-b border-gray-200 p-2">
                      {event?.description || "-"} <br /> Location :{" "}
                      {event?.location} <br />
                      <i>
                        Date:{" "}
                        {event?.date
                          ? new Date(event.date).toLocaleString()
                          : ""}
                      </i>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 2xl:col-span-1 h-full flex flex-col justify-items-start items-center gap-4 md:gap-20 xl:gap-16 2xl:gap-40 border  shadow-md  rounded-md px-4 py-4">
          <div className="w-full">
            <h3 className="text-left text-lg font-bold">
              Recent Event Statistics{" "}
            </h3>
          </div>

          <Chart
            options={options}
            series={options.series}
            type="pie"
            width="380"
          />
        </div>
      </div>
    </>
  );
}
