"use server";

import { APIError } from "better-auth/api";
import { forgetPassword } from "@/lib/auth-client";
import { emailSchema } from "@/lib/utils";

export default async function ForgotPassword(
	_state: { status: string; message: string },
	formData: FormData,
) {
	const email = String(formData.get("email"));
	const validEmail = emailSchema.safeParse({ email });

	if (!validEmail.success) {
		return {
			status: "error",
			message: "L'email n'est pas valide.",
		};
	}

	const res = { status: "", message: "" };

	try {
		await forgetPassword({
			email: validEmail.data.email,
			redirectTo: "/auth/reset-password",
			fetchOptions: {
				onError: (ctx) => {
					res.status = "error";
					res.message = ctx.error.message;
				},
				onSuccess: () => {
					res.status = "success";
					res.message =
						"Un e-mail vient de vous être envoyé. Vérifiez votre boite mail.";
				},
			},
		});

		return res;
	} catch (error) {
		if (error instanceof APIError) {
			const errCode = error.body ? error.body.code : "UNKNOWN";

			switch (errCode) {
				default:
					return {
						status: "error",
						message: String((error as Error).message ?? error),
					};
			}
		}

		return {
			status: "error",
			message: (error as Error).message || String(error),
		};
	}
}
