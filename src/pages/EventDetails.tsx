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
  BadgeCheck,
} from "lucide-react";
import { events } from "../../lib/api";
import { useAuthStore, Event } from "../authStore";
import toast from "react-hot-toast";
import OwnerImage from "@/components/OwnerImage";
import MessageBox from "@/components/messageBox";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/dashboard");
      return;
    }
  }, [user]);
  useEffect(() => {
    if (id && user) fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      console.log("Fetching event details for ID:", id);
      const data = await events.getEvent(id!);
      // Normalize attendees to always have 'id'
      const normalizedAttendees = (data.attendees as any[]).map((a) => ({
        ...a,
        id: a.id || a._id,
      }));
      data.attendees = normalizedAttendees;
      setEvent(data);
      setCompleted(data.completed || false);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error(
        error instanceof Error ? error.message : "Error loading event details"
      );

      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletionChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCompletedStatus = e.target.checked;
    try {
      const response = await events.completedEvent(id!, {
        completed: newCompletedStatus,
      });
      setCompleted(newCompletedStatus);
      toast.success(response.message);
    } catch (error) {
      console.error("Error updating completion status:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Error updating completion status"
      );
      setCompleted(!newCompletedStatus);
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      toast.error("Please sign in to register for events");
      navigate("/login");
      return;
    }

    // Prevent guest users from registering
    if (user.isGuest) {
      toast.error(
        "Guest users cannot register for events. Please create an account to register."
      );
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
              {
                id: user.id,
                email: user.email,
                username: user.username,
                pic: user.pic,
              },
            ],
          };
        });
        toast.success("Successfully registered for event");
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error(
        error instanceof Error ? error.message : "Error updating registration"
      );
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

  console.log("completed : ", completed);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
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

  // const isAttending = user
  //   ? event.attendees.some((a) => a.id === user.id)
  //   : false;
  const isAttending = user
    ? event.attendees.some((a: any) => (a.id || a._id) === user.id)
    : false;

  // const isOwner = user && (event.createdBy._id === user.id || event.createdBy.id === user.id);
  const isOwner = user && (event.createdBy as any)._id === user.id;
  const isFull = event.attendees.length >= event.maxAttendees;

  return (
    <div className="pt-0 sm:!pt-4 xl:!pt-20 h-full">
      <div className="md:max-w-3xl xl:max-w-6xl max-w-full mx-auto  px-4 md:py-8 xl:py-16 h-full ">
        <Link
          to="/events"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>

              <div className="flex space-x-2">
                <MessageBox
                  eventId={id!}
                  currentUser={user?.username!}
                  profilePic={user?.pic!}
                />
              </div>
              {isOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/createEvent/${event._id}?mode=edit`)
                    }
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
                  <p className="text-gray-600">{event?.description || "-"}</p>
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
                    <span>{event?.location || "-"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Tag className="h-5 w-5 mr-3" />
                    <span>{event?.category || "-"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <span>
                      {event?.attendees.length} / {event?.maxAttendees}{" "}
                      attendees
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <BadgeCheck className="h-5 w-5 mr-3" />
                    <span className="flex items-center gap-2">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {completed ? "Completed" : "In Progress"}
                      </span>
                      {isOwner && (
                        <input
                          type="checkbox"
                          checked={completed}
                          onChange={handleCompletionChange}
                          className="ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      )}
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
                    <div
                      className={`${
                        event?.createdBy?.pic ? " p-0 " : "bg-indigo-100 p-3"
                      }  rounded-full `}
                    >
                      {event?.createdBy?.pic ? (
                        <OwnerImage
                          image={event?.createdBy?.pic}
                          className="h-12 w-12 rounded-full "
                        />
                      ) : (
                        <Users className="h-6 w-6 text-indigo-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 font-medium">
                        {event?.createdBy.username || "-"}
                      </p>
                      <p className="text-gray-500 text-sm">Organizer</p>
                    </div>
                  </div>
                </div>

                {isOwner ? (
                  <div className="w-full py-3 px-4 rounded-md text-center font-medium bg-green-100 text-green-700">
                    You are the organizer
                  </div>
                ) : user ? (
                  user.isGuest ? (
                    <div className="w-full py-3 px-4 rounded-md text-center font-medium bg-yellow-100 text-yellow-700">
                      Guest users cannot register for events
                    </div>
                  ) : (
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
                  )
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
                    <div className=" flex flex-wrap gap-3 justify-content-center items-center">
                      {event?.attendees.map((attendee) => (
                        <div
                          key={attendee.id}
                          className="flex g-1 items-center text-gray-600"
                        >
                          <div className="bg-gray-100 rounded-full p-2">
                            {attendee?.pic ? (
                              <img
                                src={attendee?.pic}
                                alt={attendee?.username}
                                className="h-8 w-8 hover:scale-150 transition-all rounded-full"
                              />
                            ) : (
                              <Users className="h-4 w-4" />
                            )}
                          </div>
                          <span className="">{attendee?.username || "-"}</span>
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
    </div>
  );
}
