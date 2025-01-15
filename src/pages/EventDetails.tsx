import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { events } from "../../lib/api";
import { useAuthStore, Event } from "../authStore";
import toast from "react-hot-toast";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      console.log("Fetching event details for ID:", id);
      const data = await events.getEvent(id!);
      console.log("Event details received:", data);
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Error loading event details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      toast.error("Please sign in to register for events");
      navigate("/login");
      return;
    }

    if (!event) return;

    try {
      const isAttending = event.attendees.some((a) => a.id === user.id);

      if (isAttending) {
        await events.unregisterEvent(event._id);
        setEvent((prevEvent) => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            attendees: prevEvent.attendees.filter((a) => a.id !== user.id),
          };
        });
        toast.success("Successfully unregistered from event");
      } else {
        if (event.attendees.length >= event.maxAttendees) {
          toast.error("Event is full");
          return;
        }

        await events.registerEvent(event._id);
        setEvent((prevEvent) => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            attendees: [
              ...prevEvent.attendees,
              { id: user.id, email: user.email, username: user.username },
            ],
          };
        });
        toast.success("Successfully registered for event");
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Error updating registration");
    }
  };

  const handleDelete = async () => {
    if (
      !event ||
      !window.confirm("Are you sure you want to delete this event?")
    )
      return;

    try {
      setDeleting(true);
      await events.deleteEvent(event._id);
      toast.success("Event deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isAttending = user
    ? event.attendees.some((a) => a.id === user.id)
    : false;
  const isOwner = user && event.createdBy.id === user.id;
  const isFull = event.attendees.length >= event.maxAttendees;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/events/${event._id}/edit`)}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">{event.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{format(new Date(event.date), "h:mm a")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="h-5 w-5 mr-3" />
                  <span>{event.category}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3" />
                  <span>
                    {event.attendees.length} / {event.maxAttendees} attendees
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Host
                </h3>
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 font-medium">
                      {event?._id || "-"}
                    </p>
                    <p className="text-gray-500 text-sm">Organizer</p>
                  </div>
                </div>
              </div>

              {user ? (
                <button
                  onClick={handleAttendance}
                  disabled={!user || (isFull && !isAttending)}
                  className={`w-full py-3 px-4 rounded-md text-center font-medium ${
                    isAttending
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : isFull
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isAttending
                    ? "Cancel Registration"
                    : isFull
                    ? "Event is Full"
                    : "Register for Event"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 rounded-md text-center font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign in to Register
                </Link>
              )}

              {event.attendees.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Attendees
                  </h3>
                  <div className="space-y-3">
                    {event.attendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center text-gray-600"
                      >
                        <div className="bg-gray-100 rounded-full p-2">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="ml-3">{attendee.id || "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
