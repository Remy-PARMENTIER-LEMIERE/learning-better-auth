"use client";

import { TrashIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteUser } from "@/actions/admin/delete-user.action";
import { Button } from "@/components/ui/button";

const initialState = {
	status: "",
	message: "",
};

export function DeleteUserButton({ userId }: { userId: string }) {
	const [state, action, isPending] = useActionState<{
		status: string;
		message: string;
	}>(deleteUser.bind(null, userId), initialState);

	useEffect(() => {
		if (state.status === "success") {
			toast.success(state.message || "Utilisateur supprimé avec succès.");
		} else if (state.status === "error") {
			toast.error(
				state.message ||
					"Une erreur s'est produite lors de la suppression de l'utilisateur.",
			);
		}
	}, [state]);

	return (
		<form action={action}>
			<Button
				size="icon"
				variant="destructive"
				aria-label="Delete user"
				className="size-7 rounded-sm grayscale-25 hover:grayscale-0 duration-300"
				disabled={isPending}
			>
				<span className="sr-only">DELETE</span>
				<TrashIcon />
			</Button>
		</form>
	);
}

export function PlaceHolderDeleteUserButton() {
	return (
		<Button
			size="icon"
			variant="destructive"
			aria-label="Delete user"
			className="size-7 rounded-sm grayscale-25 hover:grayscale-0 duration-300"
			disabled
			title="Unauthorized"
		>
			<span className="sr-only">DELETE</span>
			<TrashIcon />
		</Button>
	);
}
