import { redirect } from "next/navigation";
import ReturnButton from "@/components/return-button/return-button";
import SendVerificationEmailForm from "./send-verification-email-form";

interface ErrorVerifyProps {
	searchParams: Promise<{ error: string }>;
}

export default async function ErrorVerify({ searchParams }: ErrorVerifyProps) {
	const error = (await searchParams).error;

	if (!error) redirect("/profile");
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<h1 className="text-3xl font-bold">Échec de la Vérification d'e-mail</h1>
			<section className="space-y-8">
				<p className="text-destructive">
					{error === "invalid_token" || error === "expired_token"
						? "Clé d'authentification invalide ou expirée. Veuillez réessayer."
						: error === "email_not_verified"
							? "Email non vérifié. Veuillez vérifier votre boîte de réception ou demander un nouvel e-mail de vérification."
							: "Oops something went wrong. Please try again later."}
				</p>
				<SendVerificationEmailForm />
				<ReturnButton href="/auth/login" label="Connexion" />
			</section>
		</main>
	);
}
