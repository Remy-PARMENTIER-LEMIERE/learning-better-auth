"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/generated/prisma";
import { admin } from "@/lib/auth-client";
import type { UserRoleSelectProps } from "@/types/user";

export default function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	const [value, setValue] = useState(role);

	async function handleChange(value: string) {
		setIsPending(true);

		const newRole = value as UserRole;

		const canChangeRole = await admin.hasPermission({
			permissions: { user: ["set-role"] },
		});

		if (canChangeRole.error) {
			toast.error("Vous n'avez pas la permission de changer ce rôle.");
			router.refresh();
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
						setValue(newRole);
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
		<Select
			disabled={role === "ADMIN" || isPending}
			value={value}
			onValueChange={handleChange}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select a role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="USER">User</SelectItem>
				<SelectItem value="ADMIN">Admin</SelectItem>
			</SelectContent>
		</Select>
	);
}
