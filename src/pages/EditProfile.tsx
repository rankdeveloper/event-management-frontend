import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound as UserIcon, UserPen, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [preview, setPreview] = useState<string | null>(user?.pic || null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },

    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      pic: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        pic: undefined,
      });
      setPreview(user.pic || null);
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    console.log("onSubmit called with data:", data);

    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    const payload = new FormData();
    payload.append("username", data.username);

    // Only append pic if it exists and is a File
    if (data.pic && data.pic instanceof File) {
      payload.append("pic", data.pic);
    }

    try {
      console.log("payload , ", payload);
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
    <div className="min-h-[80vh] flex items-center justify-center mt-10">
      <div className="w-full md:w-[30rem]  max-w-xs 2xl:max-w-md  px-0 sm:px-4 py-24 !py-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 xl:py-12">
          <div className="flex flex-start items-center gap-4 mb-8">
            <div>
              <UserPen className="h-10 w-10 text-indigo-600" />
            </div>

            <h1 className="text-lg font-bold text-center text-gray-900 ">
              Edit Profile
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full  flex items-center justify-center relative">
              <div className="relative w-[7rem] 2xl:w-[10rem] h-[7rem] 2xl:h-[10rem] rounded-full border-dotted border border-indigo-600 overflow-hidden flex items-center justify-center mb-2">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  </>
                ) : (
                  <UserIcon className="h-14 2xl:h-18 w-14 2xl:w-18 text-indigo-600" />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("pic", file, { shouldValidate: true });
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              {preview && (
                <button
                  type="button"
                  className="absolute top-2 right-14 2xl:right-[6.5rem] rounded-full transition-all duration-300 cursor-pointer shadow hover:bg-red-500"
                  onClick={() => {
                    setPreview(null);
                    setValue("pic", undefined, { shouldValidate: true });
                  }}
                  aria-label="Remove profile picture"
                >
                  <X className="text-red-500 text-sm hover:text-white" />
                </button>
              )}
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
              disabled={isSubmitting || !isValid}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
