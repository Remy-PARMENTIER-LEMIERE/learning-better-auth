"use server";

import { APIError } from "better-auth/api";
// import { auth } from "@/lib/auth";
import { signUp } from "@/lib/auth-client";

export async function signUpEmailAction(
	_state: { status: string; message: string },
	formData: FormData,
) {
	try {
		const name = String(formData.get("name"));
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));

		// const res = state;

		// La validation et la normalisation sont gérées par le middleware `auth.ts`.
		// Ici, on se contente d'appeler l'API avec les valeurs reçues.
		// await auth.api.signUpEmail({
		// 	body: {
		// 		name,
		// 		email,
		// 		password,
		// 	},
		// });

		const res = { status: "", message: "" };

		await signUp.email({
			name,
			email,
			password,
			fetchOptions: {
				onError(ctx) {
					res.status = "error";
					res.message = ctx.error.message;
				},
				onSuccess: () => {
					res.status = "success";
					res.message = "Compte créé";
				},
			},
		});

		return res;

		// return { status: "success", message: "Compte créé" };
	} catch (error: unknown) {
		if (error instanceof APIError) {
			const errCode = error.body ? error.body.code : "UNKNOWN";
			console.error(errCode);
			switch (errCode) {
				case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
					return {
						status: "error",
						message: "Un compte est déjà enregistré avec cet email.",
					};
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
