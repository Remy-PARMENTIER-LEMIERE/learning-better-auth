import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReturnButton from "@/components/return-button/return-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Profile() {
	const headersList = await headers();
	const session = await auth.api.getSession({
		headers: headersList,
	});

	if (!session) {
		redirect("/auth/login");
	}

	const FULL_POST_ACCESS = await auth.api.userHasPermission({
		headers: headersList,
		body: {
			permissions: {
				post: ["update", "delete"],
			},
		},
	});

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
				<div className="text-2xl font-bold">
					<h2>Permissions</h2>
					<ul className="flex gap-2">
						<li>
							<Button size={"sm"}>MANAGE OWN POSTS</Button>
						</li>
						<li>
							<Button size={"sm"} disabled={!FULL_POST_ACCESS.success}>
								MANAGE ALL POSTS
							</Button>
						</li>
					</ul>
				</div>
			</section>

			<pre className="text-sm overflow-clip">
				<code>{JSON.stringify(session, null, 2)}</code>
			</pre>
		</main>
	);
}
