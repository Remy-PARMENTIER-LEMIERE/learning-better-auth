"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/lib/utils";

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

		const safeData = signInSchema.safeParse({
			email: String(email),
			password: String(password),
		});

		if (!safeData.success) {
			toast.error("Veuillez vérifier vos informations.");
			return;
		}

		await signIn.email(safeData.data, {
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
			onError: (ctx) => {
				switch (ctx.error.code) {
					case "INVALID_CREDENTIALS":
						toast.error("Identifiants invalides.");
						break;
					case "USER_NOT_FOUND":
						toast.error("Utilisateur non trouvé.");
						break;
					case "EMAIL_NOT_VERIFIED":
						router.push("/auth/verify?error=email_not_verified");
						break;
					case "INVALID_EMAIL_OR_PASSWORD":
						toast.error("Email ou mot de passe invalide.");
						break;
					case "TOO_MANY_REQUESTS":
						toast.error("Trop de demandes. Veuillez réessayer plus tard.");
						break;
					case "NETWORK_ERROR":
						toast.error("Erreur réseau. Veuillez vérifier votre connexion.");
						break;
					default:
						toast.error("Une erreur est survenue.");
				}
			},
		});
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
				<div className="flex justify-between items-center gap-2">
					<Label htmlFor={passwordId} className="cursor-pointer">
						Mot de passe
					</Label>
					<Link
						href="/auth/forgot-password"
						className="text-sm italic text-muted-foreground hover:underline underline-offset-2 hover:text-foreground"
					>
						Mot de passe oublié ?
					</Link>
				</div>
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
