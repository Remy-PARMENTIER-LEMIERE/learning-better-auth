import SignInOAuthButton from "../login/sign-in-oauth-button";
import SignupForm from "./signup-form";

export default function Page() {
	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<h1 className="text-3xl font-bold">Inscription</h1>

			<section className="space-y-8">
				<SignupForm />
				<hr className="max-w-sm mx-auto" />
				<div className="flex flex-col max-w-sm mx-auto gap-4">
					<SignInOAuthButton provider="google" />
					<SignInOAuthButton provider="github" />
				</div>
			</section>
		</main>
	);
}
