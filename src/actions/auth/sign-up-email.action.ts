"use server";

import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
// import type { ErrorCode } from "@/types/auth";

export async function signUpEmailAction(
	_state: { status: string; message: string },
	formData: FormData,
) {
	try {
		const name = String(formData.get("name"));
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));

		// La validation et la normalisation sont gérées par le middleware `auth.ts`.
		// Ici, on se contente d'appeler l'API avec les valeurs reçues.
		await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
			},
		});

		return { status: "success", message: "Compte créé" };
	} catch (error) {
		if (error instanceof APIError) {
			// const errCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";
			// switch (errCode) {
			// 	default:
			// 		return { status: "error", message: String(error.message) };
			// }
		}
		return { status: "error", message: String(error) };
	}
}
