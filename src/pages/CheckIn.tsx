import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tickets } from "../../lib/api";
import { format } from "date-fns";
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  Users,
  Ticket,
  ArrowLeft,
  Search,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CheckIn() {
  const { eventId } = useParams<{ eventId: string }>();
  const [ticketInput, setTicketInput] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: eventTickets = [], isLoading } = useQuery({
    queryKey: ["event-tickets", eventId],
    queryFn: () => tickets.getEventTickets(eventId!),
    retry: 1,
  });

  const checkedInCount = eventTickets.filter((t: any) => t.checkedIn).length;

  const { mutate: doCheckIn, isPending } = useMutation({
    mutationFn: (id: string) => tickets.checkIn(id),
    onSuccess: (data) => {
      setScanResult({ success: true, ticket: data.ticket });
      toast.success("Checked in successfully!");
      queryClient.invalidateQueries({ queryKey: ["event-tickets", eventId] });
      setTicketInput("");
    },
    onError: (err: any) => {
      setScanResult({ success: false, message: err.message });
      toast.error(err.message || "Check-in failed");
    },
  });

  const handleCheckIn = () => {
    const id = ticketInput.trim();
    if (!id) return;
    setScanResult(null);
    doCheckIn(id);
  };

  useEffect(() => {
    const syncBookmarks = async () => {};

    syncBookmarks();
  }, [eventId, queryClient]);

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 pt-24 pb-14 px-4 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl">
            <ScanLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Check-In Dashboard
            </h1>
            <p className="text-indigo-200 text-sm mt-0.5">
              Verify and check in attendees
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 xl:px-20 -mt-6 pb-12 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Tickets",
              value: eventTickets.length,
              color: "text-indigo-600",
              border: "border-indigo-100",
            },
            {
              label: "Checked In",
              value: checkedInCount,
              color: "text-green-600",
              border: "border-green-100",
            },
            {
              label: "Remaining",
              value: eventTickets.length - checkedInCount,
              color: "text-amber-600",
              border: "border-amber-100",
            },
          ].map(({ label, value, color, border }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl border ${border} shadow-sm p-4 text-center`}
            >
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-indigo-500" /> Enter Ticket ID
            </h3>
            <p className="text-sm text-gray-500">
              Paste the ticket ID from the attendee's QR code
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheckIn()}
                placeholder="e.g. 3f2a1b4c-..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-mono"
              />
              <button
                onClick={handleCheckIn}
                disabled={!ticketInput.trim() || isPending}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                {isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Check In
              </button>
            </div>

            <AnimatePresence>
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl p-4 border ${
                    scanResult.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {scanResult.success ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800 text-sm">
                          Check-in Successful!
                        </p>
                        <p className="text-green-700 text-xs mt-1">
                          {scanResult.ticket?.user?.username} —{" "}
                          {scanResult.ticket?.ticketType}
                        </p>
                        {scanResult.ticket?.checkedInAt && (
                          <p className="text-green-600 text-xs mt-0.5">
                            {format(
                              new Date(scanResult.ticket.checkedInAt),
                              "h:mm a",
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 text-sm">
                          Check-in Failed
                        </p>
                        <p className="text-red-600 text-xs mt-1">
                          {scanResult.message}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <h3 className="font-bold text-gray-900 text-sm">Attendees</h3>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                </div>
              ) : eventTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <Ticket className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">No tickets booked yet</p>
                </div>
              ) : (
                eventTickets.map((ticket: any) => (
                  <div
                    key={ticket._id}
                    className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    {ticket.user?.pic ? (
                      <img
                        src={ticket.user.pic}
                        alt={ticket.user.username}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-100"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-indigo-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {ticket.user?.username}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {ticket.ticketType} ·{" "}
                        {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                      </p>
                    </div>
                    {ticket.checkedIn ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full shrink-0">
                        <BadgeCheck className="h-3.5 w-3.5" /> In
                      </span>
                    ) : (
                      <button
                        onClick={() => doCheckIn(ticket.ticketId)}
                        className="text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors shrink-0"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
