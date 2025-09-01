"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { UserRole } from "@/generated/prisma";
import { admin } from "@/lib/auth-client";
import type { UserRoleSelectProps } from "@/types/user";

export default function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();

	async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		setIsPending(true);

		const newRole = event.target.value as UserRole;

		const canChangeRole = await admin.hasPermission({
			permissions: { user: ["set-role"] },
		});

		if (!canChangeRole.error) {
			toast.error("Vous n'avez pas la permission de changer ce rôle.");
			return;
		}

		await admin.setRole({
			userId,
			role: newRole,
			fetchOptions: {
				onRequest: () => {
					setIsPending(true);
				},
				onResponse: () => {
					setIsPending(false);
				},
				onError: (ctx) => {
					toast.error(ctx.error?.message || "Une erreur est survenue.");
				},
				onSuccess: (ctx) => {
					if (ctx.data.user.role === newRole) {
						toast.success(`${ctx.data.user.name}: Rôle mis à jour.`);
						router.refresh();
					} else {
						toast.error(
							ctx.data?.message || "Échec de la mise à jour du rôle.",
						);
					}
				},
			},
		});
		router.refresh();
	}

	return (
		<select
			value={role}
			onChange={handleChange}
			disabled={role === "ADMIN" || isPending}
			className="px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<option value="USER">User</option>
			<option value="ADMIN">Admin</option>
		</select>
	);
}
