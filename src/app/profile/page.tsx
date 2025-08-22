import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Profile() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/login");
	}

	console.log(session);

	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<section className="space-y-8">
				<h1 className="text-3xl font-bold">Profile</h1>
			</section>

			<pre className="text-sm overflow-clip">
				<code>{JSON.stringify(session, null, 2)}</code>
			</pre>
		</main>
	);
}
