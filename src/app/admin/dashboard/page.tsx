import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReturnButton from "@/components/return-button/return-button";
import type { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import {
	DeleteUserButton,
	PlaceHolderDeleteUserButton,
} from "./delete-user-button";
import UserRoleSelect from "./user-role-select";

export default async function AdminDashboardPage() {
	const headersList = await headers();

	const session = await auth.api.getSession({ headers: headersList });

	if (!session) {
		redirect("/auth/login");
	}

	if (session?.user.role !== "ADMIN") {
		return (
			<main className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
				<section className="space-y-8">
					<h1 className="text-3xl font-bold">Accès refusé</h1>
					<p>Vous n'avez pas la permission d'accéder à cette page.</p>
					<ReturnButton href="/profile" label="Retour au profil" />
				</section>
			</main>
		);
	}

	const { users } = await auth.api.listUsers({
		headers: headersList,
		query: {
			sortBy: "name",
			sortDirection: "desc",
		},
	});

	const sortedUsers = users
		.sort((a, b) => {
			if (a.createdAt.getTime() < b.createdAt.getTime()) return -1;
			if (a.createdAt.getTime() > b.createdAt.getTime()) return 1;
			return 0;
		})
		.sort((a, b) => {
			if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
			if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
			return 0;
		});

	// const users = await prisma.user.findMany({
	// 	orderBy: {
	// 		createdAt: "asc",
	// 	},
	// });

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
						{sortedUsers.map((user) => (
							<tr key={user.id} className="border-b text-sm text-left">
								<td className="px-4 py-2">{user.id}</td>
								<td className="px-4 py-2">{user.name}</td>
								<td className="px-4 py-2">{user.email}</td>
								<td className="px-4 py-2 text-center">
									<UserRoleSelect
										userId={user.id}
										role={user.role as UserRole}
									/>
								</td>
								<td className="px-4 py-2 text-center has-disabled:cursor-not-allowed">
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
