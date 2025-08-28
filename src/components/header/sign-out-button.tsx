"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function SignOutButton() {
	const router = useRouter();
	const { session } = useAuth();

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
					router.refresh();
					router.push("/auth/login");
				},
			},
		});
	}

	return (
		<div className="flex items-center gap-2">
			{session?.user.role === "ADMIN" && (
				<Button size="sm" asChild>
					<Link href="/admin/dashboard">Dashboard</Link>
				</Button>
			)}
			<Button onClick={handleSignOut} size="sm" variant="destructive">
				Déconnexion
			</Button>
		</div>
	);
}
