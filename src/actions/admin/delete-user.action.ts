"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteUser(
	userId: string,
	_state: { status: string; message: string },
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || session.user.role !== "ADMIN" || session.user.id === userId) {
		throw new Error("Unauthorized");
	}

	try {
		const userToDelete = await prisma.user.findFirst({
			where: { id: userId },
		});

		if (!userToDelete) {
			return {
				status: "error",
				message: "L'utilisateur ciblé n'existe pas en base de données.",
			};
		}

		const deletedUser = await prisma.user.delete({
			where: { id: userId },
		});

		if (!deletedUser) {
			return {
				status: "error",
				message: `Échec de la suppresion de l'utilisateur : ${userToDelete.name}`,
			};
		}

		revalidatePath("/admin/dashboard");
		return {
			status: "success",
			message: `Utilisateur ${userToDelete.name} supprimé.`,
		};
	} catch (error) {
		return {
			status: "error",
			message: String(error),
		};
	}
}
