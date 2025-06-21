import { z } from "zod";

export const registerFormSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z
    .string()
    .min(7, "Email must be at least 6 characters")
    .email("Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(7, "Email must be at least 6 characters")
    .email("Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be atleast 3 characters"),
  pic: z
    .any()
    .refine(
      (file) => {
        // Allow undefined, File, or string
        return (
          file === undefined || file instanceof File || typeof file === "string"
        );
      },
      {
        message: "Image must be a valid file",
      }
    )
    .optional(),
});

export const createEventFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(5, "Description must be at least 5 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  maxAttendees: z.string().min(1, "Must be greater than 0"),
  image: z
    .any()
    .refine((file) => file instanceof File || typeof file === "string", {
      message: "Image is required",
    }),
});
