"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export default function LoginForm() {
	const emailId = useId();
	const passwordId = useId();
	const router = useRouter();

	const passwordPattern =
		"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";

	async function handleSubmit(formData: FormData) {
		const email = formData.get("email");
		const password = formData.get("password");

		if (!email || !password) {
			toast.error("Tous les champs sont requis.");
			return;
		}

		await signIn.email(
			{
				email: String(email),
				password: String(password),
			},
			{
				onRequest: () => {
					toast.loading("Connexion en cours...");
				},
				onResponse: () => {
					toast.dismiss();
					router.refresh();
				},
				onSuccess: () => {
					router.refresh();
					router.push("/profile");
				},
				onError: (err) => {
					toast.error(
						err.error.message ||
							"Une erreur est survenue lors de la connexion.",
					);
				},
			},
		);
	}

	return (
		<form action={handleSubmit} className="space-y-4">
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
				/>
			</div>

			<Button type="submit" className="w-full cursor-pointer">
				Connexion
			</Button>
		</form>
	);
}
