"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import ForgotPassword from "@/actions/auth/forgot-password.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailSchema } from "@/lib/utils";

const initialState = { status: "", message: "" };

export default function ForgotPasswordForm() {
	const router = useRouter();
	const [state, action, isPending] = useActionState(
		ForgotPassword,
		initialState,
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = String(formData.get("email"));

		if (!email || emailSchema.safeParse({ email }).success === false) {
			return toast.error("Veuillez saisir un email valide.");
		}

		startTransition(() => {
			action(formData);
		});
	};

	useEffect(() => {
		if (state.status === "success") {
			toast.success(state.message);
			router.push("/auth/forgot-password/success");
		} else if (state.status === "error") {
			toast.error(state.message);
		}
	}, [state, router]);

	return (
		<form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
			<div className="flex flex-col gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					type="email"
					id="email"
					name="email"
					required
					className="border border-gray-300 rounded-md p-2"
				/>
			</div>
			<Button type="submit" disabled={isPending}>
				Envoyer
			</Button>
		</form>
	);
}
