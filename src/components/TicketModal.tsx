import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tickets } from "../../lib/api";
import { TicketType } from "../authStore";
import { X, Ticket, CheckCircle2, IndianRupee } from "lucide-react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";

interface Props {
  eventId: string;
  eventTitle: string;
  ticketTypes: TicketType[];
  onClose: () => void;
}

export default function TicketModal({
  eventId,
  eventTitle,
  ticketTypes,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<TicketType | null>(null);
  const [bookedTicket, setBookedTicket] = useState<any>(null);
  const queryClient = useQueryClient();

  const qrValue =
    typeof bookedTicket?.qrData === "string" &&
    !bookedTicket.qrData.startsWith("data:")
      ? bookedTicket.qrData
      : bookedTicket?.ticketId || "";

  const { mutate, isPending } = useMutation({
    mutationFn: () => tickets.bookTicket(eventId, selected!.name),
    onSuccess: (data) => {
      setBookedTicket(data);
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      toast.success("Ticket booked successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to book ticket"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Ticket className="h-5 w-5" />
            <span className="font-bold text-base">Get Ticket</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {bookedTicket ? (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="bg-green-50 border border-green-200 rounded-full p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Ticket Confirmed!
                </h3>
                <p className="text-sm text-gray-500 mt-1">{eventTitle}</p>
                <span className="inline-block mt-2 text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full font-semibold">
                  {bookedTicket.ticketType} ·{" "}
                  {bookedTicket.price === 0 ? "Free" : `₹${bookedTicket.price}`}
                </span>
              </div>

              <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-4">
                <QRCode value={qrValue} size={160} />
              </div>

              <div className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg">
                ID: {bookedTicket.ticketId}
              </div>

              <p className="text-xs text-gray-400">
                Show this QR code at the event entrance
              </p>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Select a ticket type for{" "}
                <span className="font-semibold text-gray-800">
                  {eventTitle}
                </span>
              </p>

              <div className="space-y-3 mb-6">
                {ticketTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => setSelected(type)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      selected?.name === type.name
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-100 hover:border-indigo-200 bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {type.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {type.capacity} seats available
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-indigo-600">
                      {type.price === 0 ? (
                        <span className="text-green-600 text-sm font-bold">
                          Free
                        </span>
                      ) : (
                        <>
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span className="text-sm">{type.price}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => mutate()}
                disabled={!selected || isPending}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Ticket className="h-4 w-4" />
                    {selected
                      ? `Book ${selected.name} Ticket`
                      : "Select a ticket type"}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
