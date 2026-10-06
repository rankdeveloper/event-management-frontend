import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../authStore";
import { categories } from "../rowData";
import { events } from "../../lib/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventFormSchema } from "@/lib/schema";
import ErrorMessage from "@/components/ErrorMessage";

type EventFormType = z.infer<typeof createEventFormSchema>;

export default function CreateEvent() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormType>({
    resolver: zodResolver(createEventFormSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      maxAttendees: "100",
      image: "",
    },
  });

  const selectedImage = watch("image");

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const onSubmit: SubmitHandler<EventFormType> = async (data) => {
    if (!user) {
      toast.error("You must be logged in to create an event");
      return;
    }
    const payload = new FormData();
    payload.append("title", data.title);
    payload.append("description", data.description);
    payload.append("location", data.location);
    payload.append("date", data.date);
    payload.append("category", data.category);
    payload.append("maxAttendees", data.maxAttendees.toString());
    payload.append("image", data.image);
    payload.append("createdBy", user.id);

    if (mode === "edit") {
      try {
        await events.updateEvent(id!, payload);
        toast.success("Event updated successfully!");
        navigate(`/events/${id}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error updating event",
        );
      }
    } else {
      payload.append("attendees", user.id);
      try {
        await events.createEvent(payload);
        toast.success("Event created successfully!");
        navigate("/dashboard");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error creating event",
        );
      }
    }
  };

  const fetchEventDetails = async () => {
    try {
      const event = await events.getEvent(id!);
      if (event.createdBy._id.toString() !== user?.id) {
        toast.error("You can only edit your own events");
        navigate("/dashboard");
        return;
      }
      reset({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        category: event.category,
        maxAttendees: event.maxAttendees,
        image: event.image,
      });
    } catch {
      toast.error("Error loading event details");
      navigate("/dashboard");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
      hasError
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-gray-50 focus:bg-white"
    }`;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {mode === "edit" ? "Edit Event" : "Create New Event"}
                </h1>
                <p className="text-indigo-200 text-sm mt-0.5">
                  {mode === "edit"
                    ? "Update your event details"
                    : "Fill in the details to get started"}
                </p>
              </div>
            </div>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit(onSubmit as any)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Give your event a name"
                  className={inputClass(!!errors.title)}
                />
                <ErrorMessage message={errors.title?.message ?? ""} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Describe your event..."
                  className={inputClass(!!errors.description)}
                />
                <ErrorMessage message={errors.description?.message ?? ""} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register("date")}
                  className={inputClass(!!errors.date)}
                />
                <ErrorMessage message={errors.date?.message ?? ""} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location")}
                  placeholder="City, venue or online"
                  className={inputClass(!!errors.location)}
                />
                <ErrorMessage message={errors.location?.message ?? ""} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  {...register("category")}
                  className={inputClass(!!errors.category)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ErrorMessage message={errors.category?.message ?? ""} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Max Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("maxAttendees")}
                  className={inputClass(!!errors.maxAttendees)}
                />
                <ErrorMessage message={errors.maxAttendees?.message ?? ""} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Event Image
                </label>
                <label
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${errors.image ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"}`}
                >
                  <ImagePlus className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {selectedImage && typeof selectedImage !== "string"
                      ? (selectedImage as File).name
                      : typeof selectedImage === "string" && selectedImage
                        ? "Current image (upload to replace)"
                        : "Click to upload an image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setValue("image", file);
                    }}
                  />
                </label>
                <ErrorMessage
                  message={errors.image?.message?.toString() ?? ""}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "edit"
                    ? "Update Event"
                    : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
