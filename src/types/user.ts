import type { UserRole } from "@/generated/prisma";

export type UserRoleSelectProps = {
	userId: string;
	role: UserRole;
};
