import * as z from "zod";

export const checkoutSchema = z.object({
  city: z.string().trim().nonempty("City is Required").min(2, "min chars is 2"),

  details: z
    .string()
    .trim()
    .nonempty("Street Address is Required")
    .min(10, "Please add more details (street, building, floor)"),

  phone: z
    .string()
    .nonempty("Phone is Required")
    .regex(
      /^01[0125][0-9]{8}$/,
      "Enter a valid Egyptian phone number (e.g. 01012345678)",
    ),
});

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
