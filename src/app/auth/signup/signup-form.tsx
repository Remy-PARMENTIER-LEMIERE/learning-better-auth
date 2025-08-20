"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export default function SignupForm() {
	const router = useRouter();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();
	const passwordPattern =
		"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";
	const [isPending, setIsPending] = useState(false);

	// Votre fonction de validation côté client
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const name = String(formData.get("name"));
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));
		const confirmPassword = String(formData.get("confirmPassword"));

		// Validations côté client
		if (!name || !email || !password || !confirmPassword) {
			toast.error("Tous les champs sont requis.");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Les mots de passe ne correspondent pas.");
			return;
		}

		await signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onRequest: () => {
					toast.loading("Création du compte...");
					setIsPending(true);
				},
				onResponse: () => {
					toast.dismiss();
					setIsPending(false);
				},
				onSuccess: () => {
					router.push("/auth/login");
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor={nameId} className="cursor-pointer">
					Nom
				</Label>
				<Input
					id={nameId}
					name="name"
					required
					className="input-invalid"
					disabled={isPending}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor={emailId} className="cursor-pointer">
					Email
				</Label>
				<Input
					id={emailId}
					name="email"
					type="email"
					required
					className="input-invalid"
					disabled={isPending}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor={passwordId} className="cursor-pointer">
					Mot de passe
				</Label>
				<Input
					id={passwordId}
					name="password"
					type="password"
					pattern={passwordPattern}
					required
					className="input-invalid"
					disabled={isPending}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor={confirmPasswordId} className="cursor-pointer">
					Confirmer le mot de passe
				</Label>
				<Input
					id={confirmPasswordId}
					name="confirmPassword"
					type="password"
					pattern={passwordPattern}
					required
					className="input-invalid"
					disabled={isPending}
				/>
			</div>

			<Button
				type="submit"
				className="w-full cursor-pointer"
				disabled={isPending}
			>
				{isPending ? "Création..." : "S'inscrire"}
			</Button>
		</form>
	);
}
