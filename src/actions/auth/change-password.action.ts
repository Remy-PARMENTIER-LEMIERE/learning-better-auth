"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/utils";

export default async function changePasswordAction(
	_state: { status: string; message: string },
	formData: FormData,
) {
	const currentPassword = formData.get("current-password") as string;
	const newPassword = formData.get("new-password") as string;

	if (!currentPassword || !newPassword) {
		return { status: "error", message: "Tous les champs sont requis." };
	}
	if (!passwordSchema.safeParse({ password: newPassword }).success) {
		return {
			status: "error",
			message: String(
				passwordSchema.safeParse({ password: newPassword }).error?.message,
			),
		};
	}

	try {
		await auth.api.changePassword({
			headers: await headers(),
			body: {
				currentPassword,
				newPassword,
			},
		});

		return { status: "success", message: "Mot de passe changé." };
	} catch (error) {
		if (error instanceof APIError) {
			return { status: "error", message: error.message };
		}
		return { status: "error", message: String(error) };
	}
}
