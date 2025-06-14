import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../authStore";
import { categories } from "../rowData";
import { events } from "../../lib/api";

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    maxAttendees: 100,
    image: null,
  });

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to edit an event");
      return;
    }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <Calendar className="h-12 w-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Edit Event
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              rows={4}
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
              required={true}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

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
              value={formData.category}
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
              htmlFor="maxAttendees"
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}
