import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../authStore";
import { categories } from "../rowData";
import { events } from "../../lib/api";

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    maxAttendees: 100,
    image: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create an event");
      return;
    }

    if (mode === "edit") {
      try {
        const payload = new FormData();

        payload.append("title", formData.title);
        payload.append("description", formData.description);
        payload.append("location", formData.location);
        payload.append("date", formData.date);
        payload.append("category", formData.category);
        payload.append("maxAttendees", formData.maxAttendees.toString());
        payload.append("image", formData.image || "");
        payload.append("createdBy", user.id);

        console.log("payload : ", payload);
        await events.updateEvent(id!, payload);

        toast.success("Event updated successfully!");
        navigate(`/events/${id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error updating event:", error);
          toast.error(error.message || "Error updating event");
        } else {
          console.error("Unknown error updating event:", error);
          toast.error("Unknown error updating event");
        }
      }
    } else {
      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("location", formData.location);
      payload.append("date", formData.date);
      payload.append("category", formData.category);
      payload.append("maxAttendees", formData.maxAttendees.toString());
      payload.append("image", formData.image || "");
      payload.append("createdBy", user.id);
      payload.append("attendees", user.id);

      try {
        console.log("Form Data:", payload);
        await events.createEvent(payload);
        toast.success("Event created successfully!");
        navigate("/dashboard");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error creating event:", error);
          toast.error(error.message || "Error creating event");
        } else {
          console.error("Unknown error creating event:", error);
          toast.error("Unknown error creating event");
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchEventDetails = async () => {
    try {
      const event = await events.getEvent(id!);
      if (event.createdBy._id.toString() !== user?.id) {
        toast.error("You can only edit your own events");
        navigate("/dashboard");
        return;
      }
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        category: event.category,
        maxAttendees: event.maxAttendees,
        image: event?.image,
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Error loading event details");
      navigate("/dashboard");
    }
    //  finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="max-w-3xl mx-auto my-auto px-4 py-16">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </Link>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create New Event
          </h1>
        </div>

        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="flex gap-8 justify-center w-full ">
            <div className="left w-[60%] ">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  required={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleChange}
                  value={formData.description}
                ></textarea>
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
                  name="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.date}
                  onChange={handleChange}
                />
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
                  name="location"
                  required={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.location}
                  onChange={handleChange}
                />
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
                  name="image"
                  accept="image/*"
                  required={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev: any) => ({
                        ...prev,
                        image: file,
                      }));
                    }
                  }}
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
                  name="category"
                  required={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  name="maxAttendees"
                  min="1"
                  required={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleChange}
                  value={formData.maxAttendees}
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
