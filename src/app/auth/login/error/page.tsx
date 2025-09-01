import ReturnButton from "@/components/return-button/return-button";

interface ErrorLoginProps {
	searchParams: Promise<{ error: string }>;
}

export default async function ErrorLogin({ searchParams }: ErrorLoginProps) {
	const sp = await searchParams;
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<h1 className="text-3xl font-bold">Erreur de Connexion</h1>
			<section className="space-y-8">
				<p className="text-destructive">
					{sp.error === "account_not_linked"
						? "Ce compte est déjà lié à une autre méthode de connexion."
						: "Oops something went wrong. Please try again later."}
				</p>
				<ReturnButton href="/auth/login" label="Connexion" />
			</section>
		</main>
	);
}
