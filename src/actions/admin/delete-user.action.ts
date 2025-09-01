"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteUser(
	userId: string,
	_state: { status: string; message: string },
) {
	const headersList = await headers();

	const session = await auth.api.getSession({
		headers: headersList,
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
			where: { id: userId, role: "USER" },
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
		if (error instanceof Error) {
			return {
				status: "error",
				message: error.message,
			};
		}
		return {
			status: "error",
			message: "Oups something went wrong !😯",
		};
	}
}
