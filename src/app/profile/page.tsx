import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReturnButton from "@/components/return-button/return-button";
import { auth } from "@/lib/auth";

export default async function Profile() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/login");
	}

	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<section className="space-y-8">
				{session.user.role === "ADMIN" && (
					<ReturnButton
						href="/admin/dashboard"
						label="Retour au tableau de bord"
					/>
				)}
				<h1 className="text-3xl font-bold">Profile</h1>
			</section>

			<pre className="text-sm overflow-clip">
				<code>{JSON.stringify(session, null, 2)}</code>
			</pre>
		</main>
	);
}
