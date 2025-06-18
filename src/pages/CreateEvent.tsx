import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../authStore";
import { categories } from "../rowData";
import { events } from "../../lib/api";
import { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventFormSchema } from "@/lib/schema";
import ErrorMessage from "@/components/ErrorMessage";

const eventSchema = createEventFormSchema;

type EventFormType = z.infer<typeof eventSchema>;

export default function CreateEvent() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
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
  console.log("selected image : ", selectedImage);

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

    if (typeof data.image === "string") {
      payload.append("image", data.image);
    } else {
      payload.append("image", data.image);
    }

    payload.append("createdBy", user.id);

    if (mode === "edit") {
      try {
        await events.updateEvent(id!, payload);
        toast.success("Event updated successfully!");
        navigate(`/events/${id}`);
      } catch (error) {
        if (error instanceof Error)
          toast.error(error.message || "Error updating event");
      }
    } else {
      payload.append("attendees", user.id);
      try {
        await events.createEvent(payload);
        toast.success("Event created successfully!");
        navigate("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          const message = error.message || "Error creating event";
          toast.error(message);
        }
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
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Error loading event details");
      navigate("/dashboard");
    }
  };

  return (
    <div className="pt-0 sm:!pt-4 xl:!pt-20">
      <div className="md:max-w-3xl xl:max-w-6xl max-w-full mx-auto  px-4 md:py-8 xl:py-16 h-full ">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm mb:0 sm:mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="bg-white rounded-lg shadow-lg px-6 py-8 ">
          <div className="flex gap-4">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="sm:h-12 sm:w-12 h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
              Create New Event
            </h1>
          </div>

          <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row  sm:gap-8 gap-0 justify-center w-full ">
              <div className="left sm:w-[60%]  w-full">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Title
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.title?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register("title")}
                  />
                  <ErrorMessage message={errors?.title?.message ?? ""} />
                </div>

                <div className="sm:min-h-[6rem]">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    rows={6}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.description?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register("description")}
                  ></textarea>

                  <ErrorMessage message={errors?.description?.message ?? ""} />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date and Time
                  </label>

                  <input
                    type="datetime-local"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.date?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register("date")}
                  />
                  <ErrorMessage message={errors?.date?.message ?? ""} />
                </div>
              </div>

              <div className="right">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.location?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register("location")}
                  />
                  <ErrorMessage message={errors?.location?.message ?? ""} />
                </div>
                <div>
                  <label
                    htmlFor="Image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.image?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setValue("image", file);
                    }}
                  />
                  <ErrorMessage
                    message={errors?.image?.message?.toString() ?? ""}
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.category?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register("category")}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, i) => (
                      <option key={i} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <ErrorMessage message={errors?.category?.message ?? ""} />
                </div>

                <div>
                  <label
                    htmlFor="max_attendees"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors?.maxAttendees?.message
                        ? "border-red-500"
                        : "border-gray-300"
                    }  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register("maxAttendees")}
                  />

                  <ErrorMessage message={errors?.maxAttendees?.message ?? ""} />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {mode === "edit" ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
