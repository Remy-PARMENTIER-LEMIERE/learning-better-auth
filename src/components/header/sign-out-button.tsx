"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function SignOutButton() {
	const router = useRouter();
	const { setIsLogged } = useAuth();

	async function handleSignOut() {
		await signOut({
			fetchOptions: {
				onError: (err) => {
					toast.error(
						err.error.message ||
							"Une erreur est survenue lors de la déconnexion.",
					);
				},
				onSuccess: () => {
					setIsLogged(false);
					router.refresh();
					router.push("/auth/login");
				},
			},
		});
	}

	return (
		<Button onClick={handleSignOut} size="sm" variant="destructive">
			Déconnexion
		</Button>
	);
}
