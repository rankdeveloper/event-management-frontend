import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tickets } from "../../lib/api";
import { format } from "date-fns";
import { Ticket, MapPin, Calendar, CheckCircle2, Clock, X } from "lucide-react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import image1 from "../assets/image1.png";

export default function MyTickets() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const selectedQrValue =
    typeof selectedTicket?.qrData === "string" &&
    !selectedTicket.qrData.startsWith("data:")
      ? selectedTicket.qrData
      : selectedTicket?.ticketId || "";

  const { data: myTickets = [], isLoading } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: () => tickets.getMyTickets(),
    retry: 1,
  });

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 pt-24 pb-14 px-4 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Tickets</h1>
            <p className="text-indigo-200 text-sm mt-0.5">
              Your event tickets and QR codes
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 xl:px-20 mt-8 pb-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : myTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No tickets yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Browse events and book your first ticket
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {myTickets.map((ticket: any, i: number) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedTicket(ticket)}
              >
                {/* Event image strip */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={ticket.event?.image || image1}
                    alt={ticket.event?.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = image1;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-white font-bold text-sm leading-tight line-clamp-1">
                      {ticket.event?.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${
                        ticket.checkedIn
                          ? "bg-green-500 text-white"
                          : "bg-white/90 text-indigo-600"
                      }`}
                    >
                      {ticket.checkedIn ? "Checked In" : "Valid"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full font-semibold">
                      {ticket.ticketType}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    {ticket.event?.date
                      ? format(
                          new Date(ticket.event.date),
                          "MMM d, yyyy · h:mm a",
                        )
                      : "—"}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">
                      {ticket.event?.location || "—"}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono truncate">
                      {ticket.ticketId?.slice(0, 16)}…
                    </span>
                    <span className="text-xs text-indigo-500 font-semibold">
                      View QR →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ticket header */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
                <div className="text-white">
                  <p className="font-bold text-base">
                    {selectedTicket.event?.title}
                  </p>
                  <p className="text-indigo-200 text-xs mt-0.5">
                    {selectedTicket.ticketType} Ticket
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center gap-4">
                {/* Status badge */}
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                    selectedTicket.checkedIn
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}
                >
                  {selectedTicket.checkedIn ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Checked In
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" /> Valid — Not Yet Checked In
                    </>
                  )}
                </div>

                {/* QR */}
                <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-4">
                  <QRCode value={selectedQrValue} size={180} />
                </div>

                <p className="text-xs text-gray-400 font-mono text-center break-all px-2">
                  {selectedTicket.ticketId}
                </p>

                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-400">Date</span>
                    <span className="font-medium">
                      {selectedTicket.event?.date
                        ? format(
                            new Date(selectedTicket.event.date),
                            "MMM d, yyyy · h:mm a",
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-400">Location</span>
                    <span className="font-medium">
                      {selectedTicket.event?.location || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-gray-400">Price</span>
                    <span className="font-bold text-indigo-600">
                      {selectedTicket.price === 0
                        ? "Free"
                        : `₹${selectedTicket.price}`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Show this QR code at the event entrance
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
