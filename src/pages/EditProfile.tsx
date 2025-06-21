import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound as UserIcon, UserPen } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { auth } from "../../lib/api";
import { useAuthStore } from "../authStore";
import { updateProfileSchema } from "@/lib/schema";
import ErrorMessage from "@/components/ErrorMessage";

const formSchema = updateProfileSchema;

type FormType = z.infer<typeof formSchema>;

export default function EditProfile() {
  const user = useAuthStore((state) => state.user);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      pic: "",
    },
  });

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    console.log("data : ", data);

    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    const payload = new FormData();
    payload.append("username", data.username);
    if (typeof data.pic === "string") {
      payload.append("pic", data.pic);
    } else {
      payload.append("pic", data.pic!);
    }

    try {
      const { user: updatedUser } = await auth.updateUser(payload);
      useAuthStore.setState({ user: updatedUser });
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error updating profile");
      } else {
        toast.error("Error updating profile");
      }
    }
  };

  return (
    <div className="max-w-xs mx-auto  px-4 py-24">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-start items-center gap-4 mb-8">
          <div>
            <UserPen className="h-10 w-10 text-indigo-600" />
          </div>
          {/* <div className="flex flex-col items-center"> */}
          <h1 className="text-lg font-bold text-center text-gray-900 ">
            Edit Profile
          </h1>
          {/* </div> */}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full  flex items-center justify-center">
            <div className="relative w-[7rem] h-[7rem] rounded-full border-dotted border border-indigo-600 overflow-hidden flex items-center justify-center mb-2">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <UserIcon className="h-14 w-14 text-indigo-600" />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                {...register("pic")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("pic", file, { shouldValidate: true });
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors?.username ? "border-red-500 " : "border-gray-300"
              }  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            <ErrorMessage message={errors?.username?.message ?? ""} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
