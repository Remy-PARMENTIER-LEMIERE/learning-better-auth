import Link from "next/link";

export default function LoginButton() {
	return (
		<>
			<Link
				href="/auth/signup"
				className="text-white h-8 pl-2 pr-2 bg-primary flex items-center justify-center rounded"
			>
				Inscription
			</Link>
			<Link
				href="/auth/login"
				className="text-white h-8 pl-2 pr-2 bg-primary flex items-center justify-center rounded"
			>
				Connexion
			</Link>
		</>
	);
}
