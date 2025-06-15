import Chart from "react-apexcharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function Stat() {
  const options = {
    series: [44, 55, 13, 43, 22],
    chart: {
      width: 380,
      height: 380,
      type: "pie" as const,
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    legend: {
      position: "bottom" as const,
      // offsetY: 0,
      // height: 50,
      // fontSize: '14px',
      // markers: {
      //   width: 12,
      //   height: 12,
      //   radius: 6
      // },
      // itemMargin: {
      //   horizontal: 15,
      //   vertical: 0
      // },
      // containerMargin: {
      //   top: 20
      // }
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
    <div className="grid grid-cols-1 md:grid-cols-3 pt-10  gap-4 h-[90vh]">
      <div className="col-span-1 md:col-span-2 flex flex-col h-full border rounded-md px-2 py-4 shadow border-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Total Events</h3>
              <p className="text-2xl font-bold">10</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex-1 h-full">
          <h3 className="text-lg font-bold">Upcoming Events</h3>

          <Accordion type="multiple">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>Chandigarh Events</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="col-span-1 h-full flex items-center justify-center border border-indigo-500 shadow  rounded-md px-2 py-4">
        <Chart
          options={options}
          series={options.series}
          type="pie"
          width="380"
        />
      </div>
    </div>
  );
}
