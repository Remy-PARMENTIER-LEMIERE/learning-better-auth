import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReturnButton from "@/components/return-button/return-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
	DeleteUserButton,
	PlaceHolderDeleteUserButton,
} from "./delete-user-button";

export default async function AdminDashboardPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/auth/login");
	}

	if (session?.user.role !== "ADMIN") {
		return (
			<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
				<section className="space-y-8">
					<h1 className="text-3xl font-bold">Accès refusé</h1>
					<p>Vous n'avez pas la permission d'accéder à cette page.</p>
					<p>
						Vous allez être redirigé vers la page de connexion dans 2 secondes.
					</p>
				</section>
			</main>
		);
	}

	const users = await prisma.user.findMany({
		orderBy: {
			createdAt: "asc",
		},
	});

	return (
		<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
			<section className="space-y-8">
				<ReturnButton href="/profile" label="Retour au profil" />
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
			</section>
			<section className="w-full overflow-x-auto">
				<table className="table-auto minw-full whitespace-nowrap">
					<thead>
						<tr>
							<th className="px-4 py-2 text-left">ID</th>
							<th className="px-4 py-2 text-left">Nom</th>
							<th className="px-4 py-2 text-left">Email</th>
							<th className="px-4 py-2 text-center">Rôle</th>
							<th className="px-4 py-2 text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id} className="border-b text-sm text-left">
								<td className="px-4 py-2">{user.id}</td>
								<td className="px-4 py-2">{user.name}</td>
								<td className="px-4 py-2">{user.email}</td>
								<td className="px-4 py-2 text-center">{user.role}</td>
								<td
									className="px-4 py-2 text-center"
									title={user.role === "ADMIN" ? "Unauthorized" : undefined}
								>
									{user.role === "ADMIN" ? (
										<PlaceHolderDeleteUserButton />
									) : (
										<DeleteUserButton userId={user.id} />
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</main>
	);
}
