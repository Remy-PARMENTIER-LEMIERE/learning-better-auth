import GetStartedButton from "./get-started-button";

export default function Home() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center">
			<section className="flex flex-col justify-center items-center gap-8">
				<h1 className="text-6xl font-bold">Better Authy</h1>
				<GetStartedButton />
			</section>
		</main>
	);
}
