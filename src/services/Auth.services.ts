import { LoginSchemaType, RegisterSchemaType } from "@/lib/schemas/Auth.schema";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function SignUpUser(formData: RegisterSchemaType) {
  const res = await fetch(`${baseUrl}/api/v1/auth/signup`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return data;
}

export async function SignInUser(formData: LoginSchemaType) {
  const res = await fetch(`${baseUrl}/api/v1/auth/signin`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return data;
}
