import { redirect } from "next/navigation";
import ReturnButton from "@/components/return-button/return-button";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPassword({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const token = (await searchParams).token;

	if (!token) redirect("/auth/login");

	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<ReturnButton href="/auth/login" label="Connexion" />
			<h1 className="text-3xl font-bold">Réinitialisation du mot de passe</h1>
			<section className="space-y-8">
				<p className="text-foreground-muted">
					Saisissez un nouveau mot de passe pour votre compte. Il doit faire
					entre 8 et 20 caractères et contenir au moins une lettre majuscule,
					une lettre minuscule, un chiffre et un caractère spécial.
				</p>
				<ResetPasswordForm token={token} />
			</section>
		</main>
	);
}
