import SignupForm from "./signup-form";

export default function Page() {
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<section className="space-y-8">
				<h1 className="text-3xl font-bold">Inscription</h1>
			</section>

			<SignupForm />
		</main>
	);
}
