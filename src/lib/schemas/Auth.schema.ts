import * as z from "zod";

export const registerschema = z
  .object({
    name: z
      .string()
      .nonempty("name is requied")
      .min(3, "Name must be at least 3 characters")
      .max(30, "max char is 30"),

    email: z.string().nonempty("Email is requied").email("Email is not Valid"),

    password: z
      .string()
      .nonempty("password is requied")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
    rePassword: z.string().nonempty("rePassword is requied"),
    phone: z
      .string()
      .nonempty("phone is requied")
      .regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    {
      path: ["rePassword"],
      message: "Passwords do not match",
    },
  );

export type RegisterSchemaType = z.infer<typeof registerschema>;

//---------login

export const loginschema = z.object({
  email: z.string().nonempty("Email is requied").email("Email is not Valid"),

  password: z
    .string()
    .nonempty("password is requied")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
});

export type LoginSchemaType = z.infer<typeof loginschema>;

// export const changePasswordSchema = z
//   .object({
//     password: z.string().nonempty("Enter your current password."),
//     newPassword: z
//       .string()
//       .nonempty("Enter a new password.")
//       .min(8, "Password must be at least 8 characters.")
//       .regex(
//         /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/,
//         "Password must contain uppercase, lowercase, a number, and a special character.",
//       ),
//     confirmPassword: z.string().nonempty("Confirm your new password."),
//   })
//   .refine((data) => data.newPassword !== data.password, {
//     path: ["newPassword"],
//     message: "Choose a different password from your current one.",
//   })
//   .refine((data) => data.confirmPassword === data.newPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match.",
//   });

//export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
