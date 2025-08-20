import LoginForm from "./login-form";

export default function Page() {
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<section className="space-y-8">
				<h1 className="text-3xl font-bold">Connexion</h1>
			</section>

			<LoginForm />
		</main>
	);
}
