import ReturnButton from "@/components/return-button/return-button";
import ForgotPasswordForm from "./forgot-password-form";

export default function SuccessRegister() {
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<ReturnButton href="/auth/login" label="Connexion" />
			<h1 className="text-3xl font-bold">Mot de passe oublié</h1>
			<section className="space-y-8">
				<p className="text-foreground-muted">
					Saisissez votre adresse e-mail afin de recevoir un lien pour
					réinitialiser votre mot de passe.
				</p>
				<ForgotPasswordForm />
			</section>
		</main>
	);
}
