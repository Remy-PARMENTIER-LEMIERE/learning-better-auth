import ReturnButton from "@/components/return-button/return-button";

export default function SuccessForgotPassword() {
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<h1 className="text-3xl font-bold">Email envoyé</h1>
			<section className="space-y-8">
				<p className="text-foreground-muted">
					Un email de réinitialisation du mot de passe a été envoyé à votre
					adresse email. Veuillez vérifier votre boîte de réception et cliquer
					sur le lien de réinitialisation pour continuer.
				</p>
				<ReturnButton href="/auth/login" label="Connexion" />
			</section>
		</main>
	);
}
