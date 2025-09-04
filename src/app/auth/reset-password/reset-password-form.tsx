"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth-client";

export default function ResetPasswordForm({ token }: { token: string }) {
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsPending(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password");
		const confirmPassword = formData.get("confirm-password");

		if (password !== confirmPassword) {
			toast.error("Les mots de passe ne correspondent pas.");
			setIsPending(false);
			return;
		}

		await resetPassword({
			token,
			newPassword: password as string,
			fetchOptions: {
				onResponse: () => {
					setIsPending(false);
				},
				onError: (ctx) => {
					toast.error(ctx.error?.message || "Une erreur est survenue.");
				},
				onSuccess: () => {
					toast.success("Mot de passe réinitialisé avec succès.");
					router.push("/auth/login");
				},
			},
		});
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
			<div className="flex flex-col gap-2">
				<Label htmlFor="password">Nouveau mot de passe</Label>
				<Input id="password" name="password" type="password" required />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
				<Input
					id="confirm-password"
					name="confirm-password"
					type="password"
					required
				/>
			</div>

			<Button type="submit" className="w-full mt-4" disabled={isPending}>
				Réinitialiser le mot de passe
			</Button>
		</form>
	);
}
