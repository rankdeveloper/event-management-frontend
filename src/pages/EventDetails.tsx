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
  Bookmark,
  BookmarkCheck,
  Share2,
} from "lucide-react";
import { events } from "../../lib/api";
import { useAuthStore, Event } from "../authStore";
import toast from "react-hot-toast";
import OwnerImage from "@/components/OwnerImage";
import MessageBox from "@/components/messageBox";
import image1 from "../assets/image1.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    if (id && user) fetchEventDetails();
  }, [id]);

  useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => events.getBookmarks(),
    enabled: !!user && !user.isGuest,
    onSuccess: (data: any) => {
      const ids = data.bookmarks.map((b: any) => b._id || b);
      setIsBookmarked(ids.includes(id));
    },
  } as any);

  const bookmarkMutation = useMutation({
    mutationFn: () => events.toggleBookmark(id!),
    onMutate: () => setIsBookmarked((prev) => !prev),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(data.bookmarked ? "Event bookmarked!" : "Bookmark removed");
    },
    onError: () => {
      setIsBookmarked((prev) => !prev);
      toast.error("Failed to update bookmark");
    },
  });

  const handleBookmark = () => {
    if (!user) {
      toast.error("Sign in to bookmark events");
      return;
    }
    if (user.isGuest) {
      toast.error("Guest users cannot bookmark events");
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/events/${id}`;
    if (navigator.share) {
      navigator.share({ title: event?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const fetchEventDetails = async () => {
    try {
      const data = await events.getEvent(id!);
      data.attendees = (data.attendees as any[]).map((a) => ({
        ...a,
        id: a.id || a._id,
      }));
      setEvent(data);
      setCompleted(data.completed || false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error loading event details",
      );
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletionChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.checked;
    try {
      const res = await events.completedEvent(id!, { completed: val });
      setCompleted(val);
      toast.success(res.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating status",
      );
      setCompleted(!val);
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      toast.error("Please sign in");
      navigate("/login");
      return;
    }
    if (user.isGuest) {
      toast.error("Guest users cannot register for events");
      return;
    }
    if (!event) return;
    try {
      const isAttending = event.attendees.some((a) => a.id === user.id);
      if (isAttending) {
        await events.unregisterEvent(event._id);
        setEvent((prev) =>
          prev
            ? {
                ...prev,
                attendees: prev.attendees.filter((a) => a.id !== user.id),
              }
            : null,
        );
        toast.success("Unregistered from event");
      } else {
        if (event.attendees.length >= event.maxAttendees) {
          toast.error("Event is full");
          return;
        }
        await events.registerEvent(event._id);
        setEvent((prev) =>
          prev
            ? {
                ...prev,
                attendees: [
                  ...prev.attendees,
                  {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    pic: user.pic,
                  },
                ],
              }
            : null,
        );
        toast.success("Registered for event");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating registration",
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
      toast.success("Event deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Error deleting event");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Event not found
        </h2>
        <Link
          to="/dashboard"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isAttending = user
    ? event.attendees.some((a: any) => (a.id || a._id) === user.id)
    : false;
  const isOwner = user && (event.createdBy as any)._id === user.id;
  const isFull = event.attendees.length >= event.maxAttendees;
  const attendancePct = Math.min(
    (event.attendees.length / event.maxAttendees) * 100,
    100,
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          to="/events"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Events
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={event.image || image1}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {event.category && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
            )}
            {/* Top-right action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Share event"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${isBookmarked ? "bg-indigo-600 text-white" : "bg-white/20 text-white hover:bg-white/30"}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark event"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight pr-4">
                {event.title}
              </h1>
              <div className="flex items-center gap-2 shrink-0">
                <MessageBox
                  eventId={id!}
                  currentUser={user?.username!}
                  profilePic={user?.pic!}
                />
                {isOwner && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/createEvent/${event._id}?mode=edit`)
                      }
                      className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-red-500/70 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  {event.description || "-"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: Calendar,
                      label: format(new Date(event.date), "EEEE, MMMM d, yyyy"),
                    },
                    {
                      icon: Clock,
                      label: format(new Date(event.date), "h:mm a"),
                    },
                    { icon: MapPin, label: event.location || "-" },
                    { icon: Tag, label: event.category || "-" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <BadgeCheck className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="text-sm text-gray-700">Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {completed ? "Completed" : "In Progress"}
                  </span>
                  {isOwner && (
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={handleCompletionChange}
                      className="ml-auto h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-indigo-400" />
                      <span>
                        {event.attendees.length} / {event.maxAttendees}{" "}
                        attendees
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
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${isFull ? "bg-red-400" : "bg-indigo-500"}`}
                      style={{ width: `${attendancePct}%` }}
                    />
                  </div>
                </div>

                {event.attendees.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Attendees
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.attendees.map((attendee) => (
                        <div
                          key={attendee.id}
                          className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5"
                        >
                          {attendee.pic ? (
                            <img
                              src={attendee.pic}
                              alt={attendee.username}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Users className="h-3 w-3 text-indigo-500" />
                            </div>
                          )}
                          <span className="text-xs text-gray-700 font-medium">
                            {attendee.username || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Event Host
                  </h3>
                  <div className="flex items-center gap-3">
                    <div
                      className={`${event.createdBy?.pic ? "" : "bg-indigo-100 p-3"} rounded-full`}
                    >
                      {event.createdBy?.pic ? (
                        <OwnerImage
                          image={event.createdBy.pic}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {event.createdBy.username || "-"}
                      </p>
                      <p className="text-xs text-gray-500">Organizer</p>
                    </div>
                  </div>
                </div>

                {/* Share + Bookmark actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors border ${
                      isBookmarked
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {isBookmarked ? "Saved" : "Save"}
                  </button>
                </div>

                {isOwner ? (
                  <div className="w-full py-3 px-4 rounded-xl text-center text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    You are the organizer
                  </div>
                ) : user ? (
                  user.isGuest ? (
                    <div className="w-full py-3 px-4 rounded-xl text-center text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Guest users cannot register
                    </div>
                  ) : (
                    <button
                      onClick={handleAttendance}
                      disabled={!user || (isFull && !isAttending)}
                      className={`w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-colors ${
                        isAttending
                          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          : isFull
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                    className="block w-full py-3 px-4 rounded-xl text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Sign in to Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
